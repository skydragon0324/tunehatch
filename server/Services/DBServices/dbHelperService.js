import { db } from '../../Config/db.config.js';
import { getIO } from '../../Config/socket.config.js';
import { returnPerformersString } from '../../Models/Shows.js';
import { createUnmannedUserObject } from '../../Models/User.js';
import { sendEmail } from '../commsService.js';
import { verifyPerformance } from './dbIndustryService.js';
import { createSRGroup } from './dbSRService.js';
/**
 * getSingleDocument
 * Returns a single document from the database where the collection and _key is known.
 * @param {str} collection ArangoDB collection name
 * @param {_key} key ArangoDB key. This is normally VenueID, ShowID, or UserID.
 */
export async function getSingleDocument(collection, key) {
   try {
      const bindVars = { document: collection + "/" + key };
      const cursor = await db.query(`
        RETURN DOCUMENT(@document)
        `, bindVars)
      const result = await cursor.next();
      return result;
   } catch (err) {
      throw err;
   }
}

export async function getSingleShow(showID) {
   try {
      const bindVars = { showID }
      const cursor = await db.query(`
         let show = DOCUMENT(CONCAT("shows/", @showID))
         RETURN MERGE(show, ${returnPerformersString})      
      `, bindVars)
      const result = await cursor.next();
      return result;
   } catch (err) {
      throw err;
   }
}

/**
 * getSoldTickets
 * Returns all tickets sold for a show
 * @param {_key} showID 
 */
export async function getSoldTickets(showID) {
   try {
      const bindVars = { showID };
      const cursor = await db.query(`
      FOR ticketInfo IN tickets
      FILTER ticketInfo.showID == @showID
      RETURN ticketInfo.soldTickets
      `, bindVars)
      const tickets = await cursor.next();
      return tickets;
   } catch (err) {
      throw err;
   }
}
/**
 * Checks to see if a show belongs to a venue. If it does, returns show object.
 * @param {key} showID 
 * @param {key} venueID 
 */
export async function checkShowOwnership(showID, venueID) {
   const show = await getSingleDocument("shows", showID);
   if (show.venueID === venueID) {
      return show
   } else {
      return false;
   }
}

export async function getManagedVenueIDs(uid) {
   try {
      const bindVars = { uid };
      const cursor = await db.query(`
      FOR perm IN permissions
      FILTER perm.@uid != null
      RETURN perm.venueID
      `, bindVars)
      const venueIDs = await cursor.all();
      return venueIDs;
   } catch (err) {
      console.log(err);
      return false;
   }
}

/**
 * checkVenuePermissions
 * Retrieves permissions for a user for a specified venue. If permissionType is declared, will return boolean.
 * @param {_key} uid User's DisplayUID
 * @param {_key} venueID venueID
 * @param {str} permissionType (optional) Permission type to explicitly check for. If omitted, function will instead return a list of all permissions.
 */
export async function checkVenuePermissions(uid, venueID, permissionType) {
   try {
      if (uid && venueID) {
         const bindVars = {
            uid, venueID
         }
         const cursor = await db.query(`
             FOR perm IN permissions
             FILTER perm.venueID == @venueID && perm.@uid != null
             RETURN perm
          `, bindVars)
         const result = await cursor.next();
         const permissions = result?.[uid] || {};
         if (permissions) {
            if (permissionType) {
               return permissions["IS_OWNER"] || permissions["IS_ADMIN"] || permissions[permissionType];
            } else {
               return permissions
            }
         } else {
            return {};
         }
      } else if (uid) {
         return {}
      } else {
         throw new Error("PERMISSION_DENIED");
      }
   } catch (err) {
      throw (err)
   }
}

/**
 * addStripeID
 * Adds a venue or artist stripe ID to the database.
 * @param {string} viewType
 * @param {_key} targetID uid, venueID, or SRID
 * @param {str} stripeID Stripe account ID
 */
export function addStripeID(viewType, targetID, stripeID) {
   try {
      var collection;
      switch(viewType){
         case "artist":
            collection = "users";
            break;
         case "venue":
            collection = "venues";
            break;
         case "showrunner":
            collection = "showrunners";
            break;
      }
      const bindVars = {
         id: targetID,
         stripeID,
      }
      db.query(`
       UPDATE {_key: @id} WITH {
         stripe: {
           id: @stripeID
       }
      } IN ${collection}
       `, bindVars)
   } catch (err) {
      throw err;
   }
}

/**
* confirmStripeID
* Returns Stripe ID for artist or venue
* @param {_key} uid (optional) Use if checking a user
* @param {_key} venueID (optional) Use if checking a venue
*/
export async function confirmStripeID(viewType, targetID) {
   try {
      let collection;
      switch(viewType){
         case "artist":
            collection = "users"
            break;
         case "venue":
            collection = "venues"
            break;
         case "showrunner":
            collection = "showrunners"
            break;
      }
      let account = await getSingleDocument(collection, targetID)
      if (account?.stripe?.id) {
         return account.stripe.id
      } else {
         return false;
      }
   } catch (err) {
      throw err;
   }
}

export function refreshIO(io) {
   if (!io) {
      io = getIO()
   }
   return io
}

/**
 * createUnmannedUser
 * Creates an unclaimed profile
 * @param {str} type artist || host
 * @param {Object} data profile data
 * @param {Object} metadata data for email 
 */
export async function createUnmannedUser(type, data, metadata) {
   try {
      if(type === "artist"){

         const { stagename, email } = data;
      const userData = {
         email
      }
      const fanData = {}
      const artistData = {
         enabled: true,
         stagename
      }
      const hostData = {}
      const checkCursor = await db.query(`
            FOR user IN users
            FILTER LOWER(user.email) == LOWER(@email)
            RETURN user
            `, { email })
      const userExists = await checkCursor.next();
      if (userExists) {
         throw new Error("USER_ALREADY_EXISTS")
      } else {
         const userObj = createUnmannedUserObject(userData, fanData, artistData, hostData);
         console.log(userObj, "user object created")
         const bindVars = {
            user: userObj
         }
         //add user to database
         console.log("adding user to db")
         const addCursor = await db.query(`
                INSERT @user INTO users
                RETURN NEW
                `, bindVars);
         const result = await addCursor.all();
         console.log("A new SR has been signed up by a venue!");
         let user = result[0];
         user.displayUID = user._key;
         //send email with claimCode
         sendEmail("CLAIM_ARTIST", ["info@tunehatch.com", metadata.venueEmail, email], {...metadata, claimCode: user.claimCode, name: stagename})
        //return to do whatever
        return user.displayUID;
         }

         }
      
            if(type === "showrunner"){
               console.log("running showrunner")
               const key = Object.keys(data);
               data = data[key];
               const { name, email } = data;
               let uid;
               const userData = {
                  email
               }
               const fanData = {}
               const artistData = {
               }
               const hostData = {}
               const showrunnerData = {
                  enabled: true,
               }
               const checkCursor = await db.query(`
                     FOR user IN users
                     FILTER LOWER(user.email) == LOWER(@email)
                     RETURN user
                     `, { email })
               const userExists = await checkCursor.next();
               if (userExists) {
                  uid = userExists.uid
               } else {
                  const userObj = createUnmannedUserObject(userData, fanData, artistData, hostData, showrunnerData);
                  const bindVars = {
                     user: userObj
                  }
                  //add user to database
                  const addCursor = await db.query(`
                         INSERT @user INTO users
                         RETURN NEW
                         `, bindVars);
                  const result = await addCursor.all();
                  console.log("A new user has been signed up by a venue!");
                  let user = result[0];
                  user.displayUID = user._key;
                  const group = await createSRGroup(user.displayUID, {name: JSON.stringify(name)}, null, true);
                  //send email with claimCode
                  sendEmail("CLAIM_SRG", ["info@tunehatch.com", metadata.venueEmail, email], { ...metadata, claimCode: user.claimCode, name })
                  //return to do whatever
                  return group._key;
               }
            }
   } catch (err) {
      throw err
   }
}

/**
 * emailUserLookup
 * Looks up user by email 
 * @param {str} email
 */
export async function emailUserLookup(email) {
   try {
      const bindVars = {
         email
      }
      const cursor = await db.query(`
         FOR user IN users
         FILTER user.email == @email
         RETURN user
      `, bindVars)
      const result = await cursor.next();
      return result;
   } catch (err) {
      throw err;
   }
}

export async function checkShowPermissions(uid, showID) {
   try {
      try {
         showID = JSON.parse(showID)
      } catch (err) {
         showID = showID;
      }
      const performance = await verifyPerformance(showID, uid);
      if (Object.keys(performance)?.length) {
         const show = await getSingleDocument("shows", performance.showID);
         if (show.cohosted) {
            return true;
         } else {
            return false;
         }
      } else {
         return false
      }
   } catch (err) {
      throw err;
   }
}