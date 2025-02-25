import { calculateCartTotal } from "../../../src/Helpers/shared_dist/calculateCartTotal.js";
import { db } from "../../Config/db.config.js";
import { updateTicketsQuery } from "../../Models/Tickets.js";
import { getStripeIntent } from "../apiService.js";
import { sendEmail } from "../commsService.js";
import { dispatchNotification, getVenueTimezone } from "./dbService.js";
import { createTicketImage } from "../imageServices.js";
import { getSingleDocument } from "./dbHelperService.js";

export async function getAllSoldTicketData(showID, venueID) {
   try {
      if (showID && venueID) {
         const bindVars = {
            showID,
            venueID
         }
         const cursor = await db.query(`
             FOR tix IN tickets
             FILTER tix.showID == @showID && tix.venueID == @venueID
             RETURN tix
          `, bindVars);
         const result = await cursor.next();
         if (result) {
            result.adminView = true;
            return result;
         } else {
            return {
               showID,
               venueID
            };
         }
      } else {
         throw new Error("NO_ID_PROVIDED")
      }
   } catch (err) {
      throw err
   }
}

export async function updateTicketSales(showID, tickets, tiered, cartData, tierData, venueID, venueFees) {
   try {
      let cartKeys = Object.keys(cartData);
      let owedFees = venueFees?.fee || 0;
      let owedTaxes = venueFees?.tax || 0;
      let soldTickets = 0;
      if(tiered){
      for (const showID of cartKeys || []) {
         let itemKeys = Object.keys(cartData[showID]);
         for (const cartItem of itemKeys || []) {
            if (cartData[showID]?.[cartItem]?.quantity > 0) {
               tierData[cartItem].quantity = tierData[cartItem].quantity - cartData[showID][cartItem].quantity;
               soldTickets = soldTickets + cartData[showID][cartItem].quantity
            }
         }
      }
         const bindVars = { showID, tickets, tierData, owedFees, owedTaxes, venueID }
         await db.query(`
             LET scope = (FOR show IN shows
             FILTER show._key == @showID
             UPDATE {_key: @showID, ticket_tiers: @tierData, owed_fees: show.owed_fees + @owedFees, owed_taxes: show.owed_taxes + @owedTaxes} IN shows)
             ${updateTicketsQuery}
             `, bindVars)
      } else {
         for(const showID of cartKeys || []){
         const numberSold = cartData?.[showID]?.[0]?.quantity || 0;
         soldTickets = numberSold
         const bindVars = { showID, tickets, numberSold, owedFees, owedTaxes, venueID };
         await db.query(`
          LET scope = (FOR show IN shows
          FILTER show._key == @showID
          UPDATE {_key: @showID, remainingTickets: show.remainingTickets - @numberSold, owed_fees: show.owed_fees + @owedFees, owed_taxes: show.owed_taxes + @owedTaxes} IN shows)
        ${updateTicketsQuery}
       `, bindVars)
      // }
      }
      dispatchNotification(venueID, "TICKETS_SOLD", { quantity: soldTickets, showID })
   }
      return true;
   } catch (err) {
      console.log(err)
      return false;
   }
}

export async function generateTickets(showID, venueID, uid, intentID, email, name, cart, method) {
   let sendableTickets = [];
   let venueCost = null;
   const fullCartTotal = calculateCartTotal(cart)
   const expectedCartPrice = fullCartTotal.stripeTotal;
   if (fullCartTotal.venueCost.tax || fullCartTotal.venueCost.fee) {
      venueCost = {
         fee: fullCartTotal.venueCost.fee,
         tax: fullCartTotal.venueCost.tax
      }
   }
   const payment = await getStripeIntent(intentID);
   const show = await getSingleDocument("shows", showID);
   console.log(show.venueID)
   const venueTimezone = await getVenueTimezone(show.venueID);
   console.log(venueTimezone);
   const showName = show.name;
   const venue = await getSingleDocument("venues/", venueID);
   const tierData = show.ticket_tiers;
   var tickets = {};
   var tier_info;
   let tiered;
   console.log(expectedCartPrice, payment.amount_received)
   if (expectedCartPrice === payment.amount_received) {
      let cartKeys = Object.keys(cart)
      for (const showID of cartKeys) {
         let tierKeys = Object.keys(cart[showID])
         for (const ticket of tierKeys) {
            let ticketInfo = cart[showID][ticket]
            if (ticketInfo.quantity > 0) {
               if (ticket === "0" && !show.ticket_tiers) {
                  tier_info = {
                     name: "TuneHatch Ticket",
                     price: show.ticket_cost,
                     venueFee: venue.venueFee
                  }
                  tiered = false;
               } else {
                  tier_info = {...show.ticket_tiers[ticket],
                  venueFee: venue.venueFee}
                  tiered = true;
               }
               let customBackground = show.th_ticket_background
               for (let i = 0; i < ticketInfo.quantity; i++) {
                  let ticketID = showID + Math.floor(Math.random() * 100000) + 1;
                  tickets[ticketID] = {
                     id: ticketID,
                     uid,
                     email: email || "POS Purchase",
                     name: name || "POS Purchase",
                     showName: show.name,
                     genre: show.genre,
                     showID,
                     venueID,
                     method,
                     tier: tier_info.name,
                     price: Number(tier_info.price) + Number(tier_info.venueFee || 0),
                     image: email && name ? await createTicketImage(ticketID, show, venue, uid, email, tier_info, venueTimezone) : null,
                     purchased: Date.now(),
                     redeemed: email && name ? false : Date.now()
                  }
               }

               Object.keys(tickets).forEach((tID) => {
                  let ticket = tickets[tID];
                  sendableTickets.push(ticket)
               })
            }
         }
      }
   } else {
      throw new Error("CART_NOT_VERIFIED");
   }
   if (uid) {
      if (email) {
         await sendEmail('TICKET_PURCHASE', email, { showName, quantity: Object.keys(tickets)?.length || 0, venueTimezone }, sendableTickets);
      }
      updateTicketSales(showID, tickets, tiered, cart, tierData, venueID, venueCost);
      return sendableTickets;
   } else {
      console.log("A user has purchased " + Object.keys(tickets)?.length + " tickets to " + showName + "!")
      if (email) {
         await sendEmail('TICKET_PURCHASE', email, { showName, quantity: tickets?.length || 0 }, sendableTickets);
      }
      updateTicketSales(showID, tickets, tiered, cart, tierData, venueID, venueCost);
      return sendableTickets;
   }
}

export async function repairDamagedTickets(){
   try{
      const cursor = await db.query(`
      let tix = (FOR ticketData IN tickets
         LET ticketIDs = ATTRIBUTES(ticketData.soldTickets)
             FOR ticketID IN ticketIDs ? ticketIDs : []
             let returnTicket = ticketData.soldTickets[ticketID]
             RETURN returnTicket)
             FOR ticket IN tix
             FILTER ticket.image == "/"
             RETURN ticket`);
      const damagedTickets = await cursor.all();
      for(const ticket of damagedTickets){
         let show = await getSingleDocument("shows", ticket.showID)
         let venue = await getSingleDocument("venues", ticket.venueID)
         let fixedTicket = {...ticket, image: await createTicketImage(ticket.id, show, venue, ticket.uid, ticket.email, {name: "TuneHatch Ticket"})}
         let sendableTickets = [fixedTicket]
         console.log(sendableTickets);
         if (ticket.email) {
            await sendEmail('TICKET_PURCHASE', ticket.email, { showName: ticket.showName, quantity: 1 || 0 }, sendableTickets);
         }
      }
   }catch(err){
      console.log(err)
      return false;
   }
}
