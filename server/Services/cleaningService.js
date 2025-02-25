import axios from 'axios';
import jwt from 'jsonwebtoken';
import { JWTPRIV } from '../Config/config.js';
import { getManagedVenueIDs, checkVenuePermissions } from './DBServices/dbHelperService.js';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * encryptUID
* Enodes UID into a JWT
 * @param {str} plainUID A user's displayUID/key
 */
export function encryptUID(plainUID) {
   try {
      const uid = jwt.sign(plainUID, JWTPRIV)
      return uid;
   } catch (err) {
      throw new Error("UID_ERROR")
   }
}

/**
 * encryptUID
* Enodes JWT into displayUID
 * @param {str} hashedUID A user's SECRET_UID
 */
export function displayUID(hashedUID) {
   try {
      const uid = jwt.verify(hashedUID, JWTPRIV)
      return uid;
   } catch (err) {
      throw new Error("UID_ERROR")
   }
}

/**
 * cleanOutgoingData
* Returns object or array with sensitive information removed, safe for public consumption.
 * @param {str} type Accepted values: "show"
 * @param {obj | array} data Object or array to clean and return
 */
export function cleanOutgoingData(type, data) {
   let isArray = false;
   let validKeys = [];
   let object;
   let cleanedObject = {};
   let cleanedArray = [];
   if (data?.length) {
      isArray = true;
   } else {
      object = data
   }
   let ACCEPTED_TYPES = ['show', 'user'];
   type = type.toLowerCase();
   try {
      if (type && data && ACCEPTED_TYPES.includes(type)) {
         switch (type) {
            case 'show':
               validKeys = ["_key", "venueID", "name", "genre", "performers", "applications", "invites", "description", "starttime", "endtime", "min_age", "ticket_cost", "ticket_tiers", "doorPrice", "private", "genre", "capacity", "flyer", "timezone", "remainingTickets", "published", "deleted", "lineup_locked", "th_fees_included", "custom_fee", "custom_tax", "dealID", "calTag", "cohosted", "owed_taxes", "owed_fees", "showrunner", "metaPixel", "darkMode", "youtubeLink", "media", "deal", "shareStatus", "ticketImage", "venueLabel"];
               if (isArray) {
                  data.forEach((object) => {
                     cleanedObject = {}
                     validKeys.forEach((key) => {
                        cleanedObject[key] = object[key]
                     })
                     if (!cleanedObject.deleted) {
                        cleanedArray.push(cleanedObject);
                     }
                  })
               } else {
                  validKeys.forEach((key) => {
                     cleanedObject[key] = object[key];
                  })
               }
               if (isArray) {
                  return cleanedArray;
               }
               if (!cleanedObject.deleted) {
                  return cleanedObject;
               }
               break;
            case 'user':
               validKeys = ["_key", "type", "about", "avatar", "bio", "created", "firstname", "lastname", "primaryCity", "secondaryCity"];
               if (isArray) {
                  data.forEach((object) => {
                     cleanedObject = {}
                     validKeys.forEach((key) => {
                        cleanedObject[key] = object[key]
                     })
                     if (!cleanedObject.deleted) {
                        cleanedArray.push(cleanedObject);
                     }
                  })
               } else {
                  validKeys.forEach((key) => {
                     cleanedObject[key] = object[key];
                  })
               }
               if (isArray) {
                  return cleanedArray;
               }
               if (!cleanedObject.deleted) {
                  return cleanedObject;
               }
               break;
            default:
               return false;
         }
      } else {
         console.log("CleaningService.js - Object type or object not provided, or invalid type provided.")
         return false
      }
   } catch (err) {
      console.log(err)
      return false;
   }
}

/**
 * cleanVenue
 * Cleans single venue for public consumption
 * @param {obj} result Venue object
 */
export function cleanVenue(result) {
   delete result.stripe;
   return result;
}


/**
 * Handle changing times to utc in order to keep a default timezone in our DB
 */
export function convertTimestampToUTC(timestamp) {
   const utcDate = dayjs.utc(timestamp);
   return utcDate.toISOString();
}

/**
 * addToTimestamp
 * Adds variable amount of time to timestamp, returns ISO string.
 * @param {date} timestamp Timestamp
 * @param {number} addAmount Number of units to add
 * @param {string} addType dayjs compatible string. 
 */
export function addToTimestamp(timestamp, addAmount, addType){
   timestamp = dayjs.utc(timestamp);
   timestamp = timestamp.add(addAmount, addType)
   return timestamp.toISOString();
}

/**
 * cleanUser
 * Cleans single user or artist for public consumption
 * @param {obj} result User object
 */
export function cleanUser(result) {
   delete result.password;
   delete result.email;
   delete result.claimCode
   delete result.claimed
   delete result.tickets;
   delete result._id;
   delete result._rev;
   delete result.stripe
   if (result.type?.artist?.surefire) {
      delete result.type.artist.surefire?.phone
   }
   return result;
}
/**
 * getVideoLink
 * Gets full URL of embedded link
 * @param {link} link Link of Video
 */
export async function getVideoLink(link) {
   try {
      const result = await axios.get(link);
      let tempLink = result.request.res.responseUrl;
      return tempLink.replace("à", "@");
   } catch (err) {
      return false;
   }
}
/**
 * permCheck
 * Checks to ensure that a venue has the required permissions for a given route.
 * @param {Array} required Required permissions to complete the function
 * @param {Obj} userPerms Permissions passsed by middleware 
 * @param {bool} requireAll If true, requires all permissions in the array to match.
 * @param {bool} optional Does not automatically end session if permissions are not met if true.
 */
export function permCheck(required, permissions, requireAll, optional) {
   //always return true for owner and admins)
   let authorized = false
   if (Object.keys(permissions)?.length) {
      if (permissions["IS_OWNER"] || permissions["IS_ADMIN"]) {
         authorized = true;
      }
      for (const reqPerm of required) {
         if (requireAll) {
            if (!permissions[reqPerm]) {
               authorized = false
            }
         } else {
            if (permissions[reqPerm]) {
               authorized = true
            }
         }
      }
   }
   if (authorized) {
      return true
   } else if (optional) {
      return false
   }
   throw new Error("PERMISSION_DENIED")
}

/**
 * createNestedObject
 * Combines dot-notation string pairs into objects
 * @param {str} base Base name of object
 * @param {Array} names Names of objects to parse 
 * @param {str} value Value to pass
 */
const createNestedObject = (base, names, value) => {
   // attempted to remove arguments.length.
   var lastName = names.pop()
   for (var i = 0; i < names?.length; i++) {
      base = base[names[i]] = base[names[i]] || {};
   }
   if (lastName) base = base[lastName] = value;
   return base;
};

/**
 * parseNestedData
 * Combines dot-notation string pairs into objects
 * @param {obj} data Data from form to parse into objects
 */
export function parseNestedData(data) {
   var returnData = {};
   Object.keys(data).forEach((key) => {
      key = String(key);
      let deepData = key.split(".");
      if (deepData?.length === 1) {
         returnData[key] = data[key]
      } else {
         createNestedObject(returnData, deepData, data[key]);
      }
   })
   return returnData;
}

/**
 * generateVenueList
 * Given a permission type and a uid, checks to see what venues a given user has rights to manage, and returns an array of venueIDs.
 * @param {key} uid User's DisplayUID
 * @param {str} permType Permission type to check for
 */
export async function generateVenueList(uid, permType) {
   const venueIDs = await getManagedVenueIDs(uid);
   let venueList = [];
   for (const venueID of venueIDs) {
      if (await checkVenuePermissions(uid, venueID, permType)) {
         venueList.push(venueID);
      }
   }
   return venueList;
}
