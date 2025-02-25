import { repairDamagedTickets } from "../server/Services/DBServices/dbTicketService.js";

export async function repairTickets(){
    await repairDamagedTickets();
    console.log("Damaged tickets repaired and sent.")
}