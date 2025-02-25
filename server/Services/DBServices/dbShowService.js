import { db } from "../../Config/db.config.js";

/**
 * getShowData
 * @param {key} showID 
 * @returns Full data for a given show
 */
export async function getShowData(showID) {
    const bindVars = {
       showID
    };
    const showCursor = await db.query(`
    RETURN DOCUMENT(CONCAT("shows/", @showID))
    `, bindVars)
    const show = await showCursor.next();
    return show;
}