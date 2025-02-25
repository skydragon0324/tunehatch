import md5 from 'md5';
import { db } from '../../Config/db.config.js';
import { loginQuery, verifyQuery, createNewUserObject, createUnmannedUserObject, returnStatement } from '../../Models/User.js';
import { cleanOutgoingData, displayUID, encryptUID, cleanUser, cleanVenue, getVideoLink, parseNestedData } from '../cleaningService.js';
import { getSingleDocument, refreshIO } from './dbHelperService.js';
import { hash, verify } from 'argon2';
import { verifyUpload, determineUploadPaths } from '../imageServices.js';
import path from 'path';
import { renameSync, unlinkSync } from 'fs';
import { sendEmail } from '../commsService.js';
import { returnShowWithPerformersStatement } from '../../Models/Shows.js';
import { parseInstagram } from '../../../src/Helpers/shared_dist/parseInstagram.js';
import { getStripeStatus } from '../apiService.js';
import { getVenueLocationCode } from '../../../src/Helpers/shared_dist/getVenueLocationCode.js';

var io;

/**
    * Verifies cart total against server & returns an object containing whether or not the amount matches the show cost
    * @param {showID} key - Show ID
    * @param {cart} obj - Cart object, containing price and quantities.
    */
export async function verifyCartTotal(showID, cart, doorPrice) {
   let verified = true;
   const cartKeys = Object.keys(cart) || []
   for (const showID of cartKeys) {
      const show = await getSingleDocument("shows", showID);
      var ticketPrices = {};
      const customTax = show.custom_tax;
      const customFee = show.custom_fee;
      const singlePrice = !doorPrice ? show.ticket_cost : show.doorPrice || show.ticket_cost
      //support for multi tier ticketing
      if (show.ticket_tiers) {
         ticketPrices = show.ticket_tiers;
      } else {
         ticketPrices = {
            0: {
               name: null,
               price: singlePrice,
               custom_tax: customTax,
               custom_fee: customFee
            }
         }
      }
      //if price does not match db entry, return verified as false
      const tierKeys = Object.keys(cart[showID])
      for (const ticketTier of tierKeys) {
         let verified = true
         let ticket = cart[showID][ticketTier];
         if (ticket.customTax !== ticketPrices[ticketTier].custom_tax || ticketPrices[ticketTier].custom_fee !== ticket.customFee && verified) {
            verified = false;
         }
         if (ticket.quantity < 0) {
            if (ticketPrices[ticketTier].price !== ticket.price && verified) {
               verified = false;
               return false
            }
         }
      }
   }
   return verified
}

export async function dispatchNotification(targetID, type, data) {
   try {
      io = refreshIO();
      let notification;
      let notificationAdded = false;
      const timestamp = Date.now();
      switch (type) {
         case 'TICKETS_SOLD':
            notification = {
               to: targetID,
               id: "TICKETS_SOLD/" + data.showID,
               type: 'TICKETS_SOLD',
               data,
               timestamp
            }
            break;
         case 'NEW_APPLICATION':
            notification = {
               to: targetID,
               id: "NEW_APPLICATION/" + data.showID,
               type: 'NEW_APPLICATION',
               data,
               timestamp
            }
            break;
         case 'APPLICATION_ACCEPTED':
            notification = {
               to: targetID,
               id: "APPLICATION_ACCEPTED/" + data.showID,
               type: 'APPLICATION_ACCEPTED',
               data,
               timestamp
            }
            break;
         case 'APPLICATION_ACCEPTED_REQUIRES_CONFIRMATION':
            notification = {
               to: targetID,
               id: 'APPLICATION_ACCEPTED_REQUIRES_CONFIRMATION/' + data.showID,
               type: 'APPLICATION_ACCEPTED_REQUIRES_CONFIRMATION',
               data,
               timestamp
            }
            break;
         case 'INVITE_ACCEPTED':
            notification = {
               to: targetID,
               id: "INVITE_ACCEPTED/" + data.showID,
               type: 'INVITE_ACCEPTED',
               data,
               timestamp
            }
            break;
         case 'NEW_INVITE':
            notification = {
               to: targetID,
               id: "NEW_INVITE/" + data.showID,
               type: 'NEW_INVITE',
               data,
               timestamp
            }
            break;
         case 'SHOW_RESCHEDULED':
            notification = {
               id: "SHOW_RESCHEDULED/" + data.showID,
               type: 'SHOW_RESCHEDULED',
               data,
               timestamp
            }
            const bindVars = { targetID, notification }
            await db.query(`
               FOR target IN @targetID
               UPSERT { profileID: target } 
                  INSERT { 
                     profileID: target,
                     unread: [
                           MERGE(
                              {to: target},
                              @notification
                           )
                     ],
                     read: []
               } 
               UPDATE { 
                  unread: PUSH(OLD.unread, MERGE(
                     {to: target},
                     @notification
                     )
                  )
               } IN notifications
            `, bindVars);
            io.sockets.in(targetID).emit("NEW_NOTIFICATION", notification)
            notificationAdded = true;
            return true;
         default:
            console.log("Invalid notification type.")
            return false;
      }
      if (notification && !notificationAdded) {
         const bindVars = { targetID, notification }
         await db.query(`
               UPSERT { profileID: @targetID } 
                  INSERT { 
                     profileID: @targetID,
                     unread: [
                        @notification
                     ],
                     read: []
               } 
               UPDATE { 
                  unread: PUSH(OLD.unread, @notification)
               } IN notifications
            `, bindVars);
         io.sockets.in([targetID]).emit("NEW_NOTIFICATION", notification)
         return true;
      } else {
         console.log("Invalid notification type.")
         return false;
      }
   } catch (err) {
      console.log(err);
      return false;
   }
}

/**
 * getAllArtists
 * Returns all artists
 */
export async function getAllArtists() {
   try {
      var users = {}
      const cursor = await db.query(`FOR user IN users
         FILTER user.type.artist.enabled == true
         RETURN MERGE(user, {stagename: user.type.artist.stagename}, {performances: (
            FOR perf IN performances
            FILTER perf._from == CONCAT("users/", user._key) && perf.status == "accepted"
            FOR show IN shows
            FILTER show._key == perf.showID
            COLLECT x = show.venueID WITH COUNT INTO performanceCount
            SORT performanceCount DESC
            RETURN {
               "venueID": x,
               "count": performanceCount
            }
         )})`)
      for await (const result of cursor) {
         cleanUser(result)
         // for(const stat of statsList){
         // stats config
         // if(!result.stats?.[stat]?.lastUpdated && result.stats?.[stat]?.lastUpdated < Date.now()){

         // }
         // }
         users[result._key] = result;
      }
      return users;
   } catch (err) {
      throw err
   }
}
/**
 * getUsers
 * Gets one or more users
 * @param {Array} users Array of displayUIDs
 */
export async function getUsers(ids) {
   try {
      let users = {}
      const bindVars = { searchParams: ids.join('|| user._key == ') }
      //searches for all matching UIDs present in array
      const cursor = await db.query(`
         FOR user IN users
         FILTER user._key == @searchParams
         RETURN user
         `, bindVars)
      for await (const res of cursor) {
         let tRes = cleanUser(res)
         users[tRes._key] = tRes;
      }
      return users;
   } catch (err) {
      throw err
   }
}

/**
 * getVenues
 * Gets one or more venues.
 * @param {_key} venueIDs Array of venue IDs. If value is blank, will return all venues.
 */
export async function getVenues(venueIDs) {
   try {
      var searchParams;
      var venues = {};
      if (Array.isArray(venueIDs)) {
         searchParams = searchParams + venueIDs.join(" || venue._key === ")
      } else {
         searchParams = true
      }
      const bindVars = {
         searchParams: searchParams,
      }
      var cursor;
      cursor = await db.query(
         `
          FOR venue in venues 
          FILTER venue._key == @searchParams ? @searchParams : venue._key
            return venue
          `,
         bindVars
      );
      for await (const result of cursor) {
         const tRes = cleanVenue(result);
         venues[tRes._key] = tRes;
      }
      return venues
   } catch (err) {
      throw err
   }
}

/**getSRGroups
 * Retrieves all Showrunner groups
 */
export async function getSRGroups() {
   try {
      var groups = {}
      const cursor = await db.query(`
         FOR group IN showrunners
         RETURN MERGE(group, {members: (
            FOR member IN sr_memberships
            FILTER member._to == group._id
            RETURN MERGE(member, {"id": member.uid} )
         )}, {venues: (
            FOR show IN shows
            FILTER show.showrunner[0].uid == group._key
            RETURN DISTINCT show.venueID
         )}
         )
      `);
      for await (const result of cursor) {
         // for cleaning in future if needed
         delete result.stripe;
         const tRes = result;
         groups[tRes._key] = tRes
      }
      return groups;
   } catch (err) {
      throw err;
   }
}

/**
 * refreshArtistData
 * Repopulates artist data.
 */
export async function refreshArtistData(artistID) {
   // todo: set time limits for refreshing data
   try {
      const stripeEnabled = await getStripeStatus(null, artistID, "artist");
      const bindVars = {
         artistID,
         stripeEnabled: stripeEnabled?.status || false
      }
      db.query(`
   FOR artist IN users
   FILTER artist._key == @artistID
   UPDATE {_key: @artistID} WITH {stripeEnabled: @stripeEnabled} IN users
   `, bindVars)
   } catch (err) {
      console.log(err)
   }
}

/**
 * getAllShows
 * Gets all shows
 */
export async function getAllShows() {
   try {
      var allShows = {};
      const cursor = await db.query(`
          FOR show IN shows
          RETURN MERGE(show, {performers: (
            FOR perf IN performances
            FILTER perf.status == "accepted" && perf._to == CONCAT("shows/", show._key)
            RETURN {
               uid: perf.uid ? perf.uid : perf.id,
               id: perf.id,
               name: perf.name,
               showID: perf.showID,
               type: perf.type,
               status: perf.status,
               timestamp: perf.timestamp
             }
          )},
          {applications: (
            FOR perf IN performances
            FILTER perf.status == "pending" && perf.type == "application" && perf._to == CONCAT("shows/", show._key)
            RETURN {
               uid: perf.uid ? perf.uid : perf.id,
               id: perf.id,
               showID: perf.showID,
               type: perf.type,
               status: perf.status,
               timestamp: perf.timestamp
             }
          )},
          {invites: (
            FOR perf IN performances
            FILTER perf.status == "pending" && perf.type == "invite" && perf._to == CONCAT("shows/", show._key)
            RETURN {
               uid: perf.uid ? perf.uid : perf.id,
               id: perf.id,
               showID: perf.showID,
               type: perf.type,
               status: perf.status,
               timestamp: perf.timestamp
             }
          )},
          {deal: (
            FOR deal IN deals
            FILTER deal._key == show.dealID
            RETURN deal.defaults
          )[0]})
          `);
      let shows = await cursor.all();
      shows = cleanOutgoingData("show", shows);
      shows.forEach((show) => {
         allShows[show._key] = show
      })
      return allShows;
   } catch (err) {
      console.log(err);
      throw err
   }
}

/**
 * getCategoryInfo
 * Gets current artist categories
 */
export async function getCategoryInfo() {
   try {
      const categories = await getSingleDocument("internal", "th_tags");
      return { tags: categories.active_tags, categoryLimit: categories.category_limit, displayThreshold: categories.display_threshold }
   } catch (err) {
      console.log(err)
      throw err
   }
}
/**
 * getSpotlightInfo
 * Gets Spotlight information for shows, venue, artist
 */
export async function getSpotlightInfo() {
   try {
      const spotlight = await getSingleDocument("internal", "spotlight");
      const topShows = await getTopShows();
      return {
         artist: spotlight.artist,
         venue: spotlight.venue,
         shows: [...spotlight.shows, ...topShows]
      }
   } catch (err) {
      console.log(err);
      throw err;
   }
}

/**
 * getTopShows
 * Gets shows with the most sold tickets relative to their capacity
 * @param {bool} useNumberSold Uses sheer number of tickets sold instead of capacity ratio
 */
export async function getTopShows(useNumberSold) {
   try {
      var query;
      if (!useNumberSold) {
         query = `FOR ticketData IN tickets
         FOR show IN shows
         FILTER show._key == ticketData.showID
         LET ratio = show.capacity && show.capacity > 0 ? (LENGTH(ticketData.soldTickets)/show.capacity) : 0
         SORT ratio DESC
         RETURN show._key`
      } else {
         query = `FOR ticketData IN tickets
         FOR show IN shows
         FILTER show._key == ticketData.showID
         SORT LENGTH(ticketData.soldTickets) DESC
         RETURN show._key`
      }
      const cursor = await db.query(query);
      const result = await cursor.all()
      return result;
   } catch (err) {
      console.log(err);
      throw err;
   }
}


/**
 * UpdateLastLogin
 * Updates user's last login
 * @param {_key} key ArangoDB key. This is a user's DisplayUID.
 */
export async function updateLastLogin(key) {
   const currentTimestamp = Date.now()
   const bindVars = { key, currentTimestamp }
   try {
      await db.query(`
    UPDATE @key WITH {lastLogin: @currentTimestamp} IN users
    `, bindVars)
   } catch (err) {
      console.log(err);
      throw err;
   }
}


/**
 * getVenueTimezone
 * Retrieves a single venue's timezone
 * @param {_key} venueID
 * @returns timezone string
 */

export async function getVenueTimezone(venueID){
   let timezone = "America/Chicago";
   console.log(venueID);
   try{
      const venue = await getSingleDocument("venues", venueID);
   console.log(venue);
   const regions = await getActiveRegions();
   const regionCode = await getVenueLocationCode(venue);
   console.log("regionCode", regionCode)
   regions.forEach((region) => {
      if (region.locations.includes(regionCode)) {
         console.log(region.timezone, "timezone")
         timezone = region.timezone
      }else{
         console.log(region.locations)
      }
    });
    return timezone
   }catch(err){
      console.log(err)
      throw err;
   }
}

export async function registerUser(form) {
   delete form.SECRET_UID
   delete form.confirmPassword;
   form = parseNestedData(form)
   let hashedPassword = await hash(form.password)
   form.password = hashedPassword;
   try {
      if (form.firstname && form.lastname && form.email && form.password) {
         const checkCursor = await db.query(`
            FOR user IN users
            FILTER LOWER(user.email) == LOWER(@email)
            RETURN user
            `, { email: form.email })
         const userExists = await checkCursor.next();
         if (userExists) {
            throw new Error("USER_ALREADY_EXISTS")
         } else {
            const userObj = createNewUserObject(form)
            const bindVars = {
               user: userObj
            }
            //add user to database
            const addCursor = await db.query(`
                INSERT @user INTO users
                RETURN NEW
                `, bindVars);
            const result = await addCursor.all();
            console.log("A new user has signed up!");
            let user = result[0];
            //Logging in
            updateLastLogin(user._key);
            user.uid = await encryptUID(user._key);
            user.displayUID = user._key;
            delete user.password;
            delete user._key;
            return user;
         }
      } else {
         throw new Error("ALL_FIELDS_REQUIRED")
      }
   } catch (err) {
      throw err
   }
}

/**
 * verifyUser
 * Attemps to log the user in via cookie, as opposed to standard username/password
 * @param {jwt} SECRET_UID User's encrypted JWT
 */
export async function verifyUser(SECRET_UID) {
   var user;
   try {
      const uid = await displayUID(SECRET_UID);
      if (uid) {
         let bindVars = { uid };
         const cursor = await db.query(verifyQuery, bindVars);
         const result = await cursor.all();
         if (result?.length > 1) {
            throw new Error("MULTIPLE_USERS")
         } else if (result?.length === 0) {
            throw new Error("INVALID_LOGIN")
         }
         user = result[0];
         //Logging in
         updateLastLogin(user._key);
         user.uid = await encryptUID(user._key);
         user.displayUID = user._key;
         if (user?.type?.host && user.permissions) {
            user.type.host.venues = Object.keys(user.permissions)
         }
         delete user.password;
         delete user._key;
         return user
      } else {
         return false
      }
   } catch (err) {
      throw err;
   }
}

export async function invalidatePasswordReset(key) {
   try {
      const bindVars = {
         key
      }
      db.query(
         `
     FOR user IN users
     UPDATE { _key: @key, "reset_token": ""
     } IN users
     RETURN NEW`,
         bindVars
      );
   } catch (err) {
      throw err
   }
}

/**
 * getUserTickets
 * Retrieves a logged in user's tickets.
 * @param {str} uid
 */
export async function getUserTickets(uid) {
   try {
      const bindVars = {
         uid
      }
      const cursor = await db.query(`
      LET tickets = (FOR ticketData IN tickets
         FOR ticket IN VALUES(ticketData.soldTickets) || []
         FILTER ticket.uid == @uid
         RETURN ticketData.soldTickets)
         return MERGE(tickets)
      `, bindVars)
      const result = await cursor.next()
      return result;
   } catch (err) {
      throw err;
   }
}

/**
 * logIn
 * Attempts to log in user
 * @param {str} username User's email
 * @param {str} password User's plaintext password
 */
export async function logIn(username, password) {
   try {
      var user = {
         username: username,
         password: password
      };
      const bindVars = {
         username: username,
         email: username,
         phone: username,
      };
      const cursor = await db.query(loginQuery, bindVars);
      const result = await cursor.all();
      if (result?.length > 1) {
         //multiple users with same login
         throw new Error("ACCOUNT_ERROR")
      } else if (result?.length === 0) {
         //invalid username
         throw new Error("INVALID_LOGIN");
      }
      user = result[0];
      //logic for handling old-style passwords in conjunction with the new Argon2 standard
      var authorized = false;
      if (user.password.charAt(0) === "$") {
         authorized = await verify(user.password, password);
      } else {
         authorized = md5(password) === user.password
      }
      if (authorized) {
         //Logging in
         // updateLastLogin(user._key);
         user.uid = await encryptUID(user._key);
         user.displayUID = user._key;
         if (user?.type?.host && user.permissions) {
            user.type.host.venues = Object.keys(user.permissions)
         }
         delete user.password;
         delete user._key;
         return user;
      } else {
         throw new Error("INVALID_LOGIN")
      }
   } catch (err) {
      throw err
   }
}

export async function getNotifications(uid, venueList) {
   try {
      let IDList = [...venueList, uid];
      const bindVars = { IDList }
      const cursor = await db.query(`   
         let unread = (FOR profile IN notifications
            FILTER POSITION(@IDList, profile.profileID)
               FOR unread IN profile.unread
               SORT profile.timestamp
            RETURN unread)
         let read = (FOR profile IN notifications
            FILTER POSITION(@IDList, profile.profileID)
               FOR read IN profile.read
               SORT profile.timestamp
               LIMIT 100
            RETURN read)
         return {unread: unread, read: read}
         `, bindVars)
      const result = await cursor.next();
      return result;
   } catch (err) {
      throw err;
   }
}

export async function notifsAllRead(uid, venueList) {
   try {
      const IDList = [...venueList, uid];
      if (IDList?.length) {
         const bindVars = { IDList };
         const cursor = await db.query(`
         let read = (FOR profile IN notifications
            FILTER POSITION(@IDList, profile.profileID) && LENGTH(profile.unread) > 0
            UPDATE {_key: profile._key} WITH {
                unread: [],
                read: UNION(profile.unread, profile.read)
            } IN notifications
            RETURN profile.read)
            
         RETURN {unread: [], read: read}
         `, bindVars);
         const result = await cursor.next();
         let returnResult = {
            unread: result.unread,
            read: result.read[0]
         }
         return returnResult
      } else {
         throw new Error("UID_ERROR");
      }
   } catch (err) {
      throw err;
   }
}

export async function clearNotifs(uid, venueList) {
   try {
      const IDList = [...venueList, uid];
      if (IDList?.length) {
         const bindVars = { IDList }
         await db.query(`   
            FOR profile IN notifications
            FILTER POSITION(@IDList, profile.profileID)
            UPDATE {_key: profile._key} WITH {
                unread: [],
                read: []
            } IN notifications
         `, bindVars)
         return true;
      } else {
         throw new Error("UID_ERROR");
      }
   } catch (err) {
      throw err;
   }
}

export async function editProfile(uid, form, files) {
   //todo: break this up
   try {
      let errors = [];
      delete form.SECRET_UID;
      for (let key in form) {
         form[key] = JSON.parse(form[key])
      }
      let formEmail = form.email && form.email.toLowerCase();
      let formPassword = form.password;
      let changingPassword = false;
      if (formPassword && form.confirmPassword) {
         changingPassword = true
         if (!(formPassword === form.confirmPassword)) {
            formPassword = false
         }
      }
      let parsedInstagram;
      let parsedTikTok;
      let parsedYoutube;
      if (form['type.artist.socials.instagram']) {
         parsedInstagram = parseInstagram(form['type.artist.socials.instagram'])
      }
      if (form['type.artist.socials.tikTokLink']) {
         parsedTikTok = await getVideoLink(form['type.artist.socials.tikTokLink'])
      }
      if (form['type.artist.socials.youtubeLink']) {
         parsedYoutube = await getVideoLink(form['type.artist.socials.youtubeLink'])
      }
      if (parsedTikTok) {
         form['type.artist.socials.tikTokLink'] = parsedTikTok;
      } else {
         delete form['type.artist.socials.tikTokLink'];
      }
      if (parsedInstagram) {
         form['type.artist.socials.instagram'] = parsedInstagram
      } else {
         delete form['type.artist.socials.instagram'];
      } if (parsedYoutube) {
         form['type.artist.socials.youtubeLink'] = parsedYoutube;
      } else {
         delete form['type.artist.socials.youtubeLink']
      }
      delete form.email;
      delete form.required_fields;
      delete form.submission_status;
      delete form.password;
      delete form.confirmPassword;
      //if user verified, proceed with upload attempt
      //this should be moved to imageServices soon

      if (files['avatar']) {
         let file = files['avatar'][0];
         if (verifyUpload(file)) {
            let paths = await determineUploadPaths("user", uid)
            let newFile = file.filename + path.extname(file.originalname).toLowerCase()
            let targetDir = paths.targetDir + newFile;
            let displayDir = paths.displayDir + newFile;
            await renameSync(file.path, targetDir)
            form.avatar = displayDir;
         } else {
            unlinkSync(file.path);
         }
      }
      if (files['type.artist.banner']) {
         let file = files['type.artist.banner'][0];
         if (verifyUpload(file)) {
            let paths = await determineUploadPaths("user", uid)
            let newFile = file.filename + path.extname(file.originalname).toLowerCase()
            let targetDir = paths.targetDir + newFile;
            let displayDir = paths.displayDir + newFile;
            await renameSync(file.path, targetDir)
            form['type.artist.banner'] = displayDir;
         } else {
            unlinkSync(file.path);
         }
      }
      var formData = parseNestedData(form)
      let bindVars = { uid, formData };
      const userCursor = await db.query(
         `FOR user IN users
      UPDATE {_key: @uid} WITH @formData IN users
      RETURN NEW
      `, bindVars
      )
      const userResult = await userCursor.all();
      let user = userResult[0]
      //check to see if user is attempting to change password
      if (changingPassword) {
         if (formPassword) {
            formPassword = await hash(formPassword)
            let passwordVars = { uid, formPassword }
            await db.query(`
            FOR user IN users
            UPDATE {_key: @uid} WITH {password: @formPassword} IN users
            `, passwordVars)
         } else {
            errors.push("Passwords do not match.")
         }
      }
      //check to see if user is attempting to update email
      if (formEmail) {
         let checkVars = { email: formEmail }
         if (user.email.toLowerCase() !== formEmail) {
            //ensure email is not taken
            const checkCursor = await db.query(`
         FOR user IN users
         FILTER LOWER(user.email) == @email
         RETURN user
         `, checkVars)
            if (!checkCursor.hasNext) {
               let emailVars = { formEmail, uid }
               const emailCursor = await db.query(`
            FOR user IN users
            UPDATE {_key: @uid} WITH {email: @formEmail} IN users
            RETURN NEW
            `, emailVars);
               const emailResult = emailCursor.all()
               user = emailResult[0];
            } else {
               errors.push("Email is already taken.")
            }
         }
      }
      //compile errors, if any
      if (errors?.length > 0) {
         let errorMessage = errors.join(" ")
         errorMessage = errorMessage.concat(" All other changes have been saved successfully.")
         return ({ user, errorMessage })
      } else {
         return ({ user })
      }
   } catch (err) {
      console.log(err)
      //if error, delete temp file if applicable
      if (files['avatar']) {
         let file = files['avatar'][0];
         unlinkSync(file.path);
      }
      throw err;
   }
}

export async function sendPasswordReset(email) {
   try {
      if (email) {
         const findCursor = await db.query(
            `
       FOR user IN users
       FILTER LOWER(user.email) == LOWER(@email)
       RETURN user
       `,
            { email }
         );
         const user = await findCursor.next();
         if (user) {
            const reset_token = Math.floor(Math.random() * 100000) + 1;
            const bindVars = { key: user._key, reset_token };
            await db.query(
               `
         FOR user IN users
         UPDATE { _key: @key, "reset_token": @reset_token
         } IN users
         RETURN NEW`,
               bindVars
            );
            sendEmail('PASSWORD_RESET', email, { email, reset_token });
            //invalidate request after 15 minutes
            // setTimeout(invalidatePasswordReset, 900000, user._key);
            return { status: 'success' };
         } else {
            return { status: 'success' }
         }
      } else {
         throw new Error("SERVER_ERROR")
      }
   } catch (err) {
      throw err
   }
}

export async function resetPassword(token, password) {
   try {
      const hashedPassword = await hash(password);
      if (token && hashedPassword) {
         const findCursor = await db.query(
            `
         FOR user IN users
         FILTER LOWER(user.reset_token) == LOWER(@token)
         RETURN user
         `,
            { token }
         );
         const user = await findCursor.next();
         if (user) {
            const bindVars = { key: user._key, password: hashedPassword };
            const cursor = await db.query(
               `
           FOR user IN users
           UPDATE { _key: @key, "password": @password, "reset_token": ""
           } IN users
           RETURN NEW
           `,
               bindVars
            );
            const result = await cursor.next();
            result.uid = await encryptUID(user._key);
            result.displayUID = user._key;
            delete result.password;
            delete result._key;
            return result;
         } else {
            throw new Error("INVALID_TOKEN")
         }
      } else {
         throw new Error("SERVER_ERROR")
      }
   } catch (err) {
      throw err;
   }
}


export async function getUpcomingVenueShows(venueID) {
   try {
      const bindVars = {
         venueID,
         now: Date.now()
      }
      const cursor = await db.query(`
         FOR show IN shows
         FILTER show.venueID == @venueID && @now < (DATE_TIMESTAMP(show.endtime) + 18000000) && show.published && !show.deleted
         SORT show.starttime
         ${returnShowWithPerformersStatement}
      `, bindVars);
      const result = await cursor.all()
      return result;
   } catch (err) {
      throw err;
   }
}

export async function selfVerifyTicket(ticketID, uid, showID) {
   try {
      if (!uid) {
         uid = null;
      }
      let status = Date.now();
      const bindVars = {
         ticketID,
         showID,
         status
      };
      const cursor = await db.query(`
      FOR ticketInfo IN tickets
      FILTER ticketInfo.showID == @showID
      UPDATE {_key: ticketInfo._key} WITH {
         soldTickets: {
            [@ticketID] : MERGE(ticketInfo.soldTickets[@ticketID], {redeemed: ticketInfo.soldTickets[@ticketID].redeemed ? ticketInfo.soldTickets[@ticketID].redeemed : @status})
         }
      } IN tickets
      RETURN NEW
      `, bindVars)
      const result = await cursor.next();
      const soldTickets = result.soldTickets;
      const ticket = soldTickets[ticketID];
      return ticket;
   } catch (err) {
      throw err;
   }
}

export async function instagramLink(uid) {

}

export async function fetchClaimProfile(claimCode) {
   try {
      const bindVars = {
         claimCode
      }
      const cursor = await db.query(
         `FOR user IN users
         FILTER user.claimCode == @claimCode && user.claimed == false
         RETURN user`,
         bindVars);
      const result = await cursor.next();
      return result;
   } catch (err) {
      throw err;
   }
}

export async function claimProfile(form) {
   try {
      form = parseNestedData(form);
      let user = createUnmannedUserObject(form, {}, { ...form?.type?.artist }, { ...form?.type?.host });
      user.claimed = Date.now();
      delete user.claimCode;
      delete user.required_fields;
      delete user.submission_status;
      user.password = await hash(form.password)
      delete user.confirmPassword;
      const bindVars = {
         claimCode: form.claimCode,
         user
      }
      const cursor = await db.query(`
      FOR user IN users
      FILTER user.claimCode == @claimCode && user.claimed == false
      REPLACE user._key WITH @user IN users
      ${returnStatement}
   `, bindVars)
      const result = await cursor.next();
      let retUser = result;
      //Logging in
      updateLastLogin(retUser._key);
      retUser.uid = await encryptUID(retUser._key);
      retUser.displayUID = retUser._key;
      delete retUser.password;
      delete retUser._key;
      return retUser;
   } catch (err) {
      throw err;
   }
}

export async function waygts(ticketIDs, showID, artistIDs, uid) {
   try {
      const bindVars = {
         ticketIDs,
         showID,
         artistIDs,
         uid: uid || null
      }
      const cursor = await db.query(`
      FOR ticketData IN tickets
         FILTER ticketData.showID == @showID
         FOR ticketID IN @ticketIDs
         UPDATE {_key: ticketData._key} WITH {
            soldTickets: {
               [ticketID] : @uid == ticketData.soldTickets[ticketID].uid ? MERGE(ticketData.soldTickets[ticketID], {waygts: @artistIDs}) : ticketData.soldTickets[ticketID]
            }
         } IN tickets
         RETURN NEW
      `, bindVars)
      const result = await cursor.next();
      return result;
   } catch (err) {
      throw err;
   }
}

/**
 * getActiveRegions
 * Retrieves all active region data
 */
export async function getActiveRegions(){
   try{
      const cursor = await db.query(`
         FOR region IN regions
         SORT region.order
         RETURN region
      `)
      const result = await cursor.all()
      return result;
   }catch(err){
      throw err;
   }
}
