import { ticketTimestamp } from "../../../src/Helpers/shared_dist/ticketTimestamp.js";
import truncateNumber from "../../../src/Helpers/shared_dist/truncate.js";
import { db } from "../../Config/db.config.js";
import { getStripeStatus, stripeTransfer } from "../apiService.js";
import { sendEmail } from "../commsService.js";
import { getSingleDocument, getSoldTickets } from "./dbHelperService.js";
import { getShowPerformers } from "./dbIndustryService.js";



/**
 * confirmLedgerEntry
 * Confirms a ledger entry in the database
 * @param {_key} ledgerID Key value for ledger entry
 */
export async function confirmLedgerEntry(ledgerID) {
    try {
        const bindVars = { ledgerID }
        const cursor = await db.query(`
            UPDATE {_key: @ledgerID, status: "completed"} IN ledger
            RETURN NEW
        `, bindVars)
        const result = await cursor.next()
        return result;
    } catch (err) {
        console.log(err);
        throw (err);
    }
}


/**
 * createLedgerEntry
 * Creates a ledger entry in the database
 * @param {_key} id Venue or user ID
 * @param {_key} showID showID
 * @param {string} type "venue" || "artist" || "user" || "showrunner"
 * @param {Number} amount Amount paid
 * @param {String} status Status to be added to the ledger. Defaults to "pending"
 * @param {_key} ledgerID (optional) Key of ledger item
 */
export async function createLedgerEntry(id, showID, type, amount, status, ledgerID) {
    try {
        if (!status) {
            status = "pending";
        }
        const bindVars = {
            id,
            showID,
            type,
            collection: type === "venue" ? "venues" : type === "showrunner" ? "showrunners" : "users",
            amount,
            stripe_amount: amount * 100,
            timestamp: Date.now(),
            status,
            ledgerID: ledgerID || ""
        }
        const cursor = await db.query(`
        UPSERT{_key: @ledgerID}
        INSERT {
            _to: CONCAT(@collection, "/", @id),
            _from: CONCAT("shows/", @showID),
            id: @id,
            showID: @showID,
            type: @type,
            amount: @amount,
            total: @amount,
            stripe_amount: @stripe_amount,
            timestamp: @timestamp,
            status: @status
        } 
        UPDATE {
            amount: @amount,
            total: @amount,
            stripe_amount: @stripe_amount,
            timestamp: @timestamp,
            status: @status
        }
        IN ledger
        RETURN NEW
    `, bindVars)
        const result = await cursor.next();
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


/** 
 * checkLedger
 * Checks ledger for existing payments for a show. If type and ID are omitted, returns all ledger entries.
 * @param {_key} showID
 * @param {string} type (optional) "venue" || "artist" || "user"
 * @param {_key} ID venue or user ID
 */
export async function checkLedger(showID, type, id) {
    try {
        let bindVars = {
            showID
        }
        if (type && id) {
            bindVars.collection = type === "venue" ? "venues" : type === "showrunner" ? "showrunners" : "users"
            bindVars.type = type;
            bindVars.id = id
        }
        const cursor = await db.query(type && id ? `
            FOR entry IN ledger
            FILTER entry._from == CONCAT("shows/", @showID)
            FILTER entry.type == @type && entry._to == CONCAT(@collection, "/", @id)
            RETURN entry
        ` : `
            FOR entry IN ledger
            FILTER entry._from == CONCAT("shows/", @showID)
            RETURN entry
            `, bindVars)
        const result = await cursor.all()
        console.log(result)
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * saveLedgerAmount
 * Saves ledger amount without processing a payment type.
 */
export async function saveLedgerAmount(showID, type, id, total) {
    try {
        const existingLedger = (await checkLedger(showID, type, id))[0];
        const ledgerID = existingLedger?._key;
        if (existingLedger?.status === "completed") {
            return { showID: showID, confirmation: existingLedger };
        }

        await createLedgerEntry(id, showID, type, total, "saved", ledgerID);
        return { showID }
    } catch (err) {
        throw err;
    }
}

/**calculateDollarTicketSales
 * Calculates ticket sales, in dollar amount 
 * @param {_key} showID 
 */
export async function calculateDollarTicketSales(showID) {
    try {
        const tickets = await getSoldTickets(showID);
        let ticketSales = 0
        if (tickets) {
            Object.keys(tickets).forEach((ticketID) => {
                if (tickets[ticketID]) {
                    ticketSales = ticketSales + Number(tickets[ticketID].price)
                }
            })
        }
        return Number(ticketSales);
    } catch (err) {
        throw err;
    }
}


/**
 * calculatePayouts
 * Calculates payout based on show ticket sales, deal, and lineup. Returns object with amounts and stripeAmounts
 * @param {_key} showID 
 */
export async function calculatePayouts(showID) {
    let payouts = {};
    let ticketSales = 0;
    let paidSales = [];
    let paidBalance = 0;
    let deal;
    let splitAmount

    const updateLineItems = (type, text, uid) => {
        if (uid) {
            payouts[uid].lineItems.push(text);
        }
        if (type && !uid) {
            Object.keys(payouts).forEach((recipientID) => {
                if (payouts[recipientID].type === type || type === "all")
                    payouts[recipientID].lineItems.push(text)
            })
        }
    }

    const updatePayoutAmount = (type, amount, uid) => {
        if (uid) {
            if (!payouts[uid].stripe_amount) {
                payouts[uid].total = payouts[uid].total + Number(amount)
            }
        }
        if (type && !uid) {
            Object.keys(payouts).forEach((recipientID) => {
                if (payouts[recipientID].type === type && payouts[recipientID].status !== "completed")
                    payouts[recipientID].total = payouts[recipientID].total + Number(amount)
            })
        }
    }
    const show = await getSingleDocument("shows", showID);
    const tickets = await getSoldTickets(showID);
    var performers = await getShowPerformers(showID);
    const performerList = []
    const unpaidArtists = [];
    let ledgers = {};

    //remove ghost artists from payout calculations
    performers = performers.filter((performer) => (performer && (performer.id !== 0 || performer.uid !== 0) && (performer.id !== null || performer.uid !== null)))
    //generate blank payout matrix, prepopulate ledger entries
    for await (const performer of performers) {
        const ledgerData = (await checkLedger(showID, "artist", performer.uid || performer.id))[0];
        ledgers[performer.uid || performer.id] = ledgerData;
        if (!ledgerData) {
            unpaidArtists.push(performer.uid || performer.id);
        } else {
            paidSales.push(ledgerData.amount);
            console.log(ledgerData.amount)
            paidBalance = paidBalance + ledgerData.amount
        }
        payouts[performer.uid || performer.id] = {
            type: "artist",
            id: performer.uid || performer.id,
            total: 0,
            showID: show._key,
            lineItems: [],
            payouts_enabled: (await getStripeStatus(null, performer.uid || performer.id, "user")).status,
            paid: ledgerData?.status === "completed",
            ...ledgerData
        };
        performerList.push(performer.uid || performer.id);
    }
    if (show.showrunner?.[0]) {
        const SRID = show.showrunner[0].uid || show.showrunner[0].id;
        const ledgerData = (await checkLedger(showID, "showrunner", SRID))[0];
        ledgers[SRID] = ledgerData;
        if (!ledgerData) {
            unpaidArtists.push(SRID);
        } else {
            paidSales.push(ledgerData.amount);
            console.log(ledgerData.amount)
            paidBalance = paidBalance + ledgerData.amount
        }
        payouts[SRID] = {
            type: "showrunner",
            id: SRID,
            total: 0,
            showID: show._key,
            lineItems: [],
            payouts_enabled: (await getStripeStatus(null, SRID, "showrunner")).status,
            paid: ledgerData?.status === "completed",
            ...ledgerData
        };
        performerList.push(SRID);
    }
    const ledgerData = (await checkLedger(showID, "venue", show.venueID))[0];
    if (ledgerData) {
        paidSales.push(ledgerData.amount);
        console.log(ledgerData.amount)
        paidBalance = paidBalance + ledgerData.amount
    }
    payouts[show.venueID] = {
        type: "venue",
        id: show.venueID,
        total: 0,
        showID: show._key,
        lineItems: [],
        payouts_enabled: (await getStripeStatus(null, show.venueID, "venue")).status,
        paid: ledgerData?.status === "completed",
        ...ledgerData
    }
    // Calculate gross ticket sales
    if (tickets) {
        Object.keys(tickets).forEach((ticketID) => {
            if (tickets[ticketID]) {
                ticketSales = ticketSales + Number(tickets[ticketID].price)
            }
        })
    } else {
        ticketSales = 0
    }
    updatePayoutAmount("venue", ticketSales, show.venueID);
    updateLineItems("all", "$" + ticketSales + " Gross Ticket Sales");
    if (show.th_fees_included) {
        ticketSales = ticketSales - show.owed_fees;
        updateLineItems("all", "-" + show.owed_fees + " Processing Fee");
        ticketSales = ticketSales - show.owed_taxes;
        updateLineItems("all", "-" + show.owed_taxes + " Taxes");
    }
    // todo: check ledger for existing payments


    //check deal details
    if (show.dealID) {
        // if deal exists, check specifics. Otherwise, pay out venue
        deal = await getSingleDocument("deals", show.dealID)
        if (deal.type === "ticket_split") {
            splitAmount = truncateNumber(((ticketSales - paidBalance) / (unpaidArtists.length)))
            updatePayoutAmount("venue", -ticketSales, show.venueID);
            updateLineItems("venue", "- $" + ticketSales + " Ticket Split With Artists", show.venueID);
        }
        if (deal?.defaults?.production_fee) {
            let prodFee = deal?.defaults.production_fee;
            if (!(payouts[show.venueID].total + prodFee > ticketSales)) {
                updatePayoutAmount("venue", prodFee, show.venueID);
                updateLineItems("venue", "+ $" + prodFee + " Production Fee", show.venueID)
            } else {
                updatePayoutAmount("venue", ticketSales, show.venueID);
                updateLineItems("venue", "+ $" + ticketSales + "Partial Production Fee", show.venueID)
            }
            // prod fee for artists
            prodFee = (deal.defaults.production_fee / unpaidArtists.length)
            prodFee = Math.ceil((prodFee + Number.EPSILON) * 100) / 100;
            updatePayoutAmount("artist", -prodFee);
            updateLineItems("artist", "- $" + prodFee + " Production Fee")
        }
        performerList.forEach((performerID) => {
            let tDeal = deal[performerID];
            if (tDeal?.guarantee) {
                updatePayoutAmount(null, tDeal.guarantee, performerID);
                updateLineItems(null, "+ $" + tDeal.guarantee + " Guarantee", performerID)
                // update guarantee for venue
                updatePayoutAmount(null, -tDeal.guarantee, show.venueID);
                updateLineItems(null, "- $" + tDeal.guarantee + " Guarantee", show.venueID)
            }
            if (deal.type === "ticket_split") {
                paidSales.forEach((saleAmount) => {
                    if (saleAmount !== (splitAmount + (deal?.guarantee || 0) - (deal?.production_fee || 0))) {
                        updateLineItems("artist", "- $" + saleAmount + " Custom Artist Payout", performerID);
                    }
                })
                if (!payouts[performerID].amount) {
                    updatePayoutAmount("artist", splitAmount, performerID);
                    updateLineItems("artist", "+ $" + splitAmount + " Ticket Split (" + unpaidArtists.length + " artists)", performerID);
                } else {
                    updatePayoutAmount("artist", payouts[performerID].amount, performerID);
                    updateLineItems("artist", "+ $" + payouts[performerID].amount + " Custom Ticket Split Payout", performerID);
                }
            }
        })
    } else {
        const ledgerData = (await checkLedger(showID, "venue", show.venueID))[0];
        payouts[show.venueID] = {
            type: "venue",
            total: ticketSales,
            id: show.venueID,
            showID: show._key,
            lineItems: [],
            additionalPayment: false,
            payouts_enabled: (await getStripeStatus(null, show.venueID, "venue")).status,
            paid: ledgerData?.status === "completed",
            ...ledgerData
        }
    }
    Object.keys(payouts).forEach((recipientID) => {
        //override with ledger data
        payouts[recipientID].total = ledgers[recipientID]?.total || payouts[recipientID].total
        payouts[recipientID].amount = ledgers[recipientID]?.amount || payouts[recipientID].amount
        console.log(payouts[recipientID].total)
        if (Number(payouts[recipientID].total) < 0) {
            payouts[recipientID].total = 0;
            payouts[recipientID].amount = 0
        }
        if (payouts[recipientID].total)
            payouts[recipientID].stripeTotal = payouts[recipientID].total * 100
    })
    console.log(payouts)
    return { _key: showID, payouts };
}

export async function getStripeID(id, type) {
    let result;
    switch (type) {
        case "venue":
        result = await getSingleDocument("venues", id);
        break;
        case "showrunner": 
        result = await getSingleDocument("showrunners", id);
        break;
        default: 
        result = await getSingleDocument("users", id);
    }
    return result?.stripe?.id || false;
}

export async function sendPayment(paymentObject) {
    try {
        let additionalPayment = paymentObject.additionalPayment ? Number(paymentObject.additionalPayment) : false;
        if (Number(paymentObject.total) >= 1 || additionalPayment >= 1) {
            let stripeTotal = additionalPayment ? additionalPayment * 100 : Number(paymentObject.total) * 100
            let totalSales = 0;
            let user;
            let venue;
            const show = await getSingleDocument("shows", paymentObject.showID);
            if (paymentObject.type !== "venue") {
                if (paymentObject.type === "showrunner") {
                    user = await getSingleDocument("showrunners", paymentObject.id)
                } else {
                    user = await getSingleDocument("users", paymentObject.id)
                }
                venue = await getSingleDocument("venues", show.venueID);
            }
            const tickets = await getSoldTickets(paymentObject.showID);
            Object.keys(tickets).forEach((ticketID) => {
                if (tickets[ticketID]) {
                    totalSales = totalSales + Number(tickets[ticketID].price)
                }
            })
            if (show.th_fees_included) {
                totalSales = totalSales - Number(show.owed_fees);
                totalSales = totalSales - Number(show.owed_taxes);
            }
            let accountID = await getStripeID(paymentObject.id, paymentObject.type)
            if (accountID) {
                let ledger = await checkLedger(paymentObject.showID);
                console.log(ledger)
                let existingLedger = ledger.filter((ledger) => ledger.id === paymentObject.id && ledger.type === paymentObject.type);
                existingLedger = existingLedger[0]
                if (existingLedger?.status === "completed" && !additionalPayment) {
                    return { showID: show._key, confirmation: existingLedger };
                }

                //ensure total paid amounts plus the current payment will not exceed total ticket sales
                console.log(additionalPayment)
                let ledgerTotal = additionalPayment || Number(paymentObject.total);
                ledger.forEach((ledgerItem) => {
                    if (ledgerItem.status === "completed") {
                        ledgerTotal = Number(ledgerTotal) + Number(ledgerItem.total)
                    }
                })
                if (ledgerTotal > totalSales) {
                    throw new Error("OVER_LIMIT");
                }
                var ledgerEntry;
                if (!additionalPayment) {
                    ledgerEntry = await createLedgerEntry(paymentObject.id, paymentObject.showID, paymentObject.type, Number(paymentObject.total), "pending", existingLedger?._key);
                } else {
                    ledgerEntry = await createLedgerEntry(paymentObject.id, paymentObject.showID, paymentObject.type, Number(existingLedger?.total) + additionalPayment, "pending", existingLedger?._key);
                }
                const transfer = await stripeTransfer(accountID, Number(stripeTotal), "Payout for " + show.name);
                if (transfer) {
                    let confirmation = await confirmLedgerEntry(ledgerEntry._key);
                    if (paymentObject.type !== "venue") {
                        let name = paymentObject.type === "showrunner" ? user.name : user?.type?.artist?.stagename ? user.type.artist.stagename : user.firstname + " " + user.lastname
                        sendEmail('PAYOUT_INITIATED', [paymentObject.type === "showrunner" ? user.contact.email : user.email, "info@tunehatch.com"], {
                            name,
                            venueName: venue.name,
                            showDate: (ticketTimestamp(show.starttime)).date,
                            showName: show.name,
                            payoutAmount: additionalPayment || confirmation.amount
                        })
                    }
                    // let newPayouts = await calculatePayouts(show._key);
                    return { showID: show._key, confirmation: { ...confirmation, additionalPayment: false } }
                }
            }
            throw new Error("NO_STRIPE_ACCOUNT")
        } else {
            return { showID: paymentObject.showID, confirmation: paymentObject }
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**updateCashLedger 
 * Updates cash ledger with new amouunts
 * @param {_key} venueID
 * @param {_key} showID 
 * @param {String} type "bar" or "tickets"
 * @param {Number} amount Amount in dollars
*/
export async function updateCashLedger(venueID, showID, type, amount) {
    try {
        const bindVars = {
            showID,
            venueID,
            type,
            amount,
            timestamp: Date.now()
        }
        const cursor = await db.query(`
            UPSERT {showID: @showID}
            INSERT {
                showID: @showID,
                venueID: @venueID,
                entries: {
                    [@type]: @amount,
                },
                timestamp: @timestamp
            }
            UPDATE {
                entries: MERGE(OLD.entries,
                    {[@type]: @amount}),
                timestamp: @timestamp
            }
            IN cash_ledger
            RETURN NEW
        `, bindVars)
        const result = await cursor.next();
        return result;
    } catch (err) {
        throw err;
    }
}

/**
 * checkCashLedger
 * Returns either the cash ledger for a show/venue or a blank ledger matrix
 * @param {_key} venueID 
 * @param {_key} showID
 */
export async function checkCashLedger(venueID, showID) {
    try {
        const bindVars = {
            venueID,
            showID
        }
        const cursor = await db.query(`
            FOR ledger IN cash_ledger
            FILTER ledger.venueID == @venueID && @showID ? ledger.showID == @showID : ledger.showID
            RETURN MERGE(ledger)
        `, bindVars);
        const result = await cursor.next();
        console.log(result);
        return result;
    } catch (err) {
        throw err;
    }
}
