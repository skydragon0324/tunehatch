import { db } from '../../Config/db.config.js';
import { dispatchNotification } from './dbService.js';

/**
 * apply
 * Used for an artist to apply for a gig
 * @param {key} showID
 * @param {key} uid User's displayUID
 */
export async function apply(venueID, showID, uid, phone) {
    try {
        const bindVars = {
            uid,
            showID,
            phone: phone || null
        }
        const cursor = await db.query(`
        UPSERT { _from: CONCAT("users/", @uid), _to: CONCAT("shows/", @showID) } 
        INSERT { 
            _to: CONCAT("shows/", @showID),
            _from: CONCAT("users/", @uid), 
            uid: @uid,
            phone: @phone,
            showID: @showID,
            type: "application",
            status: "pending",
            timestamp: DATE_NOW()
        } 
        UPDATE { 
            type: "application",
            phone: @phone,
            status: "pending"
        } IN performances
        RETURN NEW
        `, bindVars)
        const result = await cursor.next();
        dispatchNotification( venueID, "NEW_APPLICATION", { showID, artistID: uid })
        return result;
    }catch(err){
        throw err;
    }
}

/**
 * Used for when an artist applies to a gig hosted by a venue that requires text confirmation
 * @param {key} uid User's displayUID
 * @param {key} artistContactNumber the artist contact # for venues requiring text confirmation
 */
export async function upsertArtistContactNumber(uid, contactNumber) {
    try {
        const bindVars = {
            uid,
            contactNumber
        };

        const cursor = await db.query(`
            UPSERT { _key: @uid }
            INSERT {
                _key: @uid,
                contactNumber: @contactNumber
            }
            UPDATE {
                contactNumber: @contactNumber
            } IN users
            RETURN NEW
        `, bindVars);

        const result = await cursor.next();
        return result;
    } catch (err) {
        throw err;
    }
}