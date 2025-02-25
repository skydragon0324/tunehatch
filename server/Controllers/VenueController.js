import { calculatePayouts, saveLedgerAmount, sendPayment } from "../Services/DBServices/dbFinanceService.js";
import { verifyPerformance } from "../Services/DBServices/dbIndustryService.js";
import { getAllSoldTicketData } from "../Services/DBServices/dbTicketService.js";
import { createShow, updatePerformanceAgreement, editVenueProfile, getVenueAdminData, rescheduleShow, redeemTicket, getShowNotes, editShow, deleteShow, saveDeal, editShowNotes, getShowPayoutStatus} from "../Services/DBServices/dbVenueService.js";
import { permCheck } from "../Services/cleaningService.js";
import { sendStripeReminderEmail } from "../Services/commsService.js";

export async function getSoldTickets(req, res, next) {
    try {
        var tickets = {}
        const REQUIRED_PERMISSIONS = ["CAN_SEE_NUMBER_SOLD"]
        let authorized = permCheck(REQUIRED_PERMISSIONS, res.locals.permissions, false, true);
        if (authorized) {
            tickets = await getAllSoldTicketData(req.body.showID, req.body.venueID)
        } else {
            //see if artist is a performer able to see ticket information
            const performance = await verifyPerformance(req.body.showID, res.locals.uid);
            if (performance.status === "accepted") {
                var tTix = await getAllSoldTicketData(req.body.showID, req.body.venueID);
                tTix = tTix.soldTickets || [];
                Object.keys(tTix).forEach((tID) => {
                    tickets[tID] = {
                        price: tTix[tID].price
                    }
                })
                tickets.soldTickets = {
                    ...tickets
                }
            }
        }
        res.send(tickets);
    } catch (err) {
        next(err)
    }
}

const _getVenueAdminData = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["IS_ADMIN"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        const data = await getVenueAdminData();
        res.send(data);
    } catch (err) {
        next(err);
    }
};
export { _getVenueAdminData as getVenueAdminData };

const _editVenueProfile = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_EDIT_VENUE"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions, false);
        const venue = await editVenueProfile(req.body.venueID, req.body, req.files);
        res.send(venue);
    } catch (err) {
        next(err);
    }
};
export { _editVenueProfile as editVenueProfile };


const _createShow = async (req, res, next) => {
    try {
        if (res.locals.venueID != null) {
            const REQUIRED_PERMISSIONS = ["CAN_CREATE_SHOW"];
            permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        }

        const show = await createShow(req.body.form);
        res.send(show);
    } catch (err) {
        next(err);
    }
};
export { _createShow as createShow };

const _rescheduleShow = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_EDIT_SHOW"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        const show = await rescheduleShow(req.body.form);
        res.send(show);
    } catch (err) {
        next(err);
    }
};
export { _rescheduleShow as rescheduleShow };

const _updatePerformanceAgreement = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_MANAGE_PERFORMANCE_AGREEMENT"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        const venue = await updatePerformanceAgreement(req.body.venueID, req.body.agreement);
        res.send(venue);
    } catch (err) {
        next(err);
    }
};
export { _updatePerformanceAgreement as updatePerformanceAgreement };

export async function getVenuePermissions(req, res, next) {
    try {
        if (res.locals.permissions["IS_ADMIN"] || res.locals.permissions["OWNER"]) {
            getVenuePermissions(req.body.venueID);
        } else {
            res.send(res.locals.permissions)
        }
    } catch (err) {
        next(err);
    }
}

const _getShowPayoutStatus = async(req, res, next) => {
    try{
        const payoutStatus = await getShowPayoutStatus(req.body.showIDs);
        res.send(payoutStatus);
    }catch(err){
        next(err)
    }
}

export {_getShowPayoutStatus as getShowPayoutStatus}

const _redeemTicket = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_MANAGE_GUESTLIST"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        const status = await redeemTicket(req.body.showID, req.body.ticketID, req.body.redeemed, res.locals.permissions);
        res.send(status);
    } catch (err) {
        next(err);
    }
};
export { _redeemTicket as redeemTicket };

const _getShowNotes = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_UPDATE_NOTES"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        const notes = await getShowNotes(req.body.showID, req.body.venueID);
        res.send(notes);
    } catch (err) {
        next(err);
    }
};
export { _getShowNotes as getShowNotes };

const _editShow = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_EDIT_SHOW"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        const show = await editShow(req.body.form);
        res.send(show);
    } catch (err) {
        next(err);
    }
};
export { _editShow as editShow };

const _deleteShow = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_EDIT_SHOW"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        const show = await deleteShow(req.body.showID, req.body.venueID);
        res.send(show);
    } catch (err) {
        next(err);
    }
};
export { _deleteShow as deleteShow };

const _saveDeal = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_EDIT_DEALS"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        const deal = await saveDeal(req.body.form);
        res.send(deal);
    } catch (err) {
        next(err);
    }
};
export { _saveDeal as saveDeal };

const _editShowNotes = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_UPDATE_NOTES"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions, false);
        const show = await editShowNotes(req.body, req.files);
        res.send(show);
    } catch (err) {
        next(err);
    }
}

export { _editShowNotes as editShowNotes };

const _calculatePayouts = async (req, res, next) => {
    try {
        const payouts = await calculatePayouts(req.body.showID);
        res.send(payouts);
    } catch (err) {
        next(err)
    }
}

export { _calculatePayouts as calculatePayouts };

const _sendPayment = async (req, res, next) => {
    try {
        // todo: link permissions more thoroughly
        const confirmation = await sendPayment(req.body.paymentObject);
        res.send(confirmation);
    } catch (err) {
        next(err);
    }
}

const _updateLedgerAmount = async(req, res, next) => {
    try{
        await saveLedgerAmount(req.body.showID, req.body.type, req.body.id, req.body.total);
        res.send(true);
    }catch(err){
        next(err);
    }
}

export {_updateLedgerAmount as updateLedgerAmount}

export { _sendPayment as sendPayment };

const _sendStripeReminderEmail = async (req, res, next) => {
    try {
        sendStripeReminderEmail(req.body.id, req.body.showID)
        res.send(true)
    } catch (err) {
        next(err);
    }
}

export {_sendStripeReminderEmail as sendStripeReminderEmail}
