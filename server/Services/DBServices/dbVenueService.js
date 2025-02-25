import { db } from '../../Config/db.config.js';
import { addToTimestamp, convertTimestampToUTC, getVideoLink, parseNestedData } from '../cleaningService.js';
import { sendSMS, sendEmail } from '../commsService.js';
import path from 'path';
import { renameSync, unlinkSync } from 'fs';
import { uploadBaseImage, verifyUpload, determineUploadPaths } from '../imageServices.js';
import { dispatchNotification } from './dbService.js';
import { getSingleDocument, getSoldTickets, checkShowOwnership } from './dbHelperService.js';
import { ticketTimestamp } from '../../../src/Helpers/shared_dist/ticketTimestamp.js';
import { getOrdinal } from '../../../src/Helpers/shared_dist/repeatingMath.js';
import { generateOffPlatformShowrunner, generateOffPlatformVenue, generatePerformerData } from './dbIndustryService.js';
import { calculateDollarTicketSales, checkLedger } from './dbFinanceService.js';
import { parseInstagram } from '../../../src/Helpers/shared_dist/parseInstagram.js';
import { PUBLICURL } from '../../Config/config.js';

export async function getVenueAdminData(venueID) {
   try {
      if (venueID) {
         const bindVars = { venueID };
         const venueCursor = await db.query(`
             RETURN DOCUMENT(CONCAT("venues/", @venueID))
          `, bindVars);
         const result = await venueCursor.next();
         result.adminView = true;
         return result;
      }
   } catch (err) {
      throw err
   }
}

export async function editVenueProfile(venueID, form, files) {
   try {
      console.log(form)
      let formImages = form.images?.length > 0 ? [...form.images] : [];
      delete form.images
      let maxImages = 3;
      delete form.SECRET_UID;
      delete form.images
      delete form.venueID;
      delete form.required_fields;
      delete form.submission_status
      console.log(form);
      for (let key in form) {
         form[key] = JSON.parse(form[key])
      }
      let parsedInstagram;
      let parsedTikTok;
      let parsedYoutube;
      if (form['socials.instagram']) {
         parsedInstagram = parseInstagram(form['socials.instagram'])
      }
      if (form['socials.tikTokLink']) {
         parsedTikTok = await getVideoLink(form['socials.tikTokLink'])
      }
      if (form['socials.youtubeLink']) {
         parsedYoutube = await getVideoLink(form['socials.youtubeLink'])
      }
      if (parsedTikTok) {
         form['socials.tikTokLink'] = parsedTikTok;
      } else {
         delete form['socials.tikTokLink'];
      }
      if (parsedInstagram) {
         form['socials.instagram'] = parsedInstagram
      } else {
         delete form['socials.instagram'];
      } if (parsedYoutube) {
         form['socials.youtubeLink'] = parsedYoutube;
      } else {
         delete form['socials.youtubeLink']
      }
      if (files['avatar']) {
         let file = files['avatar'][0];
         if (verifyUpload(file)) {
            let paths = await determineUploadPaths("venue", venueID)
            let newFile = file.filename + path.extname(file.originalname).toLowerCase()
            let targetDir = paths.targetDir + newFile;
            let displayDir = paths.displayDir + newFile;
            await renameSync(file.path, targetDir)
            form.avatar = displayDir;
         } else {
            unlinkSync(file.path);
         }
      }
      //ARRAY UPLOADING LOGIC
      var newImages = 0
      var allImages = 0
      for (var image of formImages) {
         console.log(files['images']?.[0])
         if (image === "newImage") {
            if (files['images']) {
               let newImage = files['images'][newImages];
               console.log(newImage, "new img")
               if (newImage && verifyUpload(newImage)) {
                  let paths = await determineUploadPaths("venue", venueID)
                  let newFile = newImage.filename + path.extname(newImage.originalname).toLowerCase()
                  let targetDir = paths.targetDir + newFile;
                  let displayDir = paths.displayDir + newFile;
                  console.log(newImage.path, targetDir)
                  await renameSync(newImage.path, targetDir)
                  image = displayDir
               } else {
                  // unlinkSync(newImage.path);
                  image = null;
               }
            } else {
               image = null;
            }
            newImages = newImages + 1
         } else {
            image = image !== "null" && image !== null ? image : null;
         }
         formImages[allImages] = image
         allImages = allImages + 1
      }
      form.images = formImages;
      //ARRAY UPLOADING LOGIC END
      if (files['banner']) {
         let file = files['banner'][0];
         if (verifyUpload(file)) {
            let paths = await determineUploadPaths("venue", venueID)
            let newFile = file.filename + path.extname(file.originalname).toLowerCase()
            let targetDir = paths.targetDir + newFile;
            let displayDir = paths.displayDir + newFile;
            await renameSync(file.path, targetDir)
            form.banner = displayDir;
         } else {
            console.log("Banner upload failed for venue")
            unlinkSync(file.path);
         }
      }
      //check form images against venue
      const lookupVars = { id: venueID }
      const venueCursor = await db.query(`
      RETURN DOCUMENT(CONCAT("venues/", @id))
      `, lookupVars)
      let checkVenue = await venueCursor.next();
      let existingImages = checkVenue.images;
      if (!existingImages) {
         existingImages = Array(maxImages);
      }
      if (form.images) {
         form.images.forEach((image, i) => {
            if (!form.images[i]) {
               form.images[i] = existingImages[i]
            }
         })
      }
      var formData = parseNestedData(form)
      const metadata = formData.meta
      delete formData.meta
      if (metadata?.locationData) {
         const ac = metadata.locationData.address_components
         if (ac) {
            formData.location = {
               ...formData.location,
               address: ac.find((c) => c.types.includes("street_number")).long_name + " " +
                  ac.find((c) => c.types.includes("route")).long_name,
               city: ac.find((c) => c.types.includes("locality")).long_name,
               state: ac.find((c) => c.types.includes("administrative_area_level_1")).long_name,
               zip: ac.find((c) => c.types.includes("postal_code")).long_name
            }
         } else {
         }
         const geo = metadata.locationData.geometry?.location
         if (geo) {
            formData.location = {
               ...formData.location,
               lat: geo.lat,
               lng: geo.lng
            }
         }
         formData.location.metadata = metadata.locationData
      }
      const bindVars = { id: venueID, formData };
      const venueUpdateCursor = await db.query(
         `FOR venue IN venues
         FILTER venue._key == @id
         UPDATE {_key: @id} WITH @formData IN venues
         RETURN NEW
      `, bindVars
      )
      const venueResult = await venueUpdateCursor.next();
      return venueResult;
   } catch (err) {
      console.log(err)
      //if error, delete temp file if applicable
      if (files['avatar']) {
         let file = files['avatar'][0];
         unlinkSync(file.path);
      }
      if (files['images']) {
         files['images'].forEach((image, i) => {
            let file = files['images'][i]
            unlinkSync(file.path)
         })
      }
      console.log(err);
      throw err
   }
}

/**
 * getShowPayoutStatus
 * Checks show payout status. Returns "full", "partial", or "unpaid"
 */
export async function getShowPayoutStatus(showIDs) {
   try {
      let statuses = {};
      for (const show of showIDs) {
         let showID = show._key
         const totalTicketSales = await calculateDollarTicketSales(showID);
         let totalPaid = 0;
         const ledgers = await checkLedger(showID);
         for (const ledger of ledgers) {
            if (ledger.status === "completed") {
               totalPaid = totalPaid + Number(ledger.total || 0);
            }
         }
         if (totalPaid === totalTicketSales && totalTicketSales) {
            statuses[showID] = "full";
         } else if (!totalTicketSales) {
            statuses[showID] = "hidden";
         } else if (totalPaid === 0) {
            statuses[showID] = "unpaid"
         } else {
            statuses[showID] = "partial"
         }
      }
      return statuses
   } catch (err) {
      throw err;
   }
}


export async function saveDealProfile(venueID, deal, metadata) {
   let sDeal = {}
   //save deal profile to venue for future use
   sDeal.type = deal.type;
   sDeal.name = metadata.dealName;
   sDeal.type = deal.type
   sDeal.label = metadata.dealName
   sDeal.options = deal.options
   sDeal.defaults = deal.defaults
   const makeDefault = metadata.defaultDeal
   const dealVars = {
      venueID: venueID,
      dealName: metadata.dealName,
      deal: sDeal,
      makeDefault
   }
   try {
      await db.query(`
      FOR venue IN venues
      FILTER venue._key == @venueID
      UPDATE {_key: @venueID} WITH {
         dealProfiles : {
            @dealName: @deal
         },
         defaultDeal: @makeDefault ? @dealName : venue.defaultDeal
      } IN venues
      `, dealVars)
   } catch (err) {
      throw err
   }
}

export async function generateDealID(venueID, deal, performers) {
   try {
      let newDeal = {
         venueID: venueID,
         type: deal.type,
         defaults: { type: deal.type, ...deal.defaults },
         deals: {
         }
      }
      performers.forEach((performer) => {
         newDeal.deals[performer.uid] = {
            uid: performer.uid,
            ...newDeal.defaults
         }

      })
      const bindVars = { newDeal }
      const dealCursor = await db.query(`
         INSERT @newDeal INTO deals 
         RETURN NEW
      `, bindVars);
      const result = await dealCursor.next();
      return result._key;
   } catch (err) {
      throw err;
   }
}

export async function rescheduleShow(form) {
   try {
      const { showID, venueID, starttime, endtime } = form;
      const showData = await getSingleDocument("shows", showID);
      let verified = true;
      if (showData.venueID !== venueID) {
         verified = false;
      }
      if (verified) {
         const bindVars = { showID, starttime, endtime }
         const cursor = await db.query(`
         FOR show IN shows
         FILTER show._key == @showID
         UPDATE {_key: @showID} WITH {starttime: @starttime, endtime: @endtime} IN shows
         RETURN NEW
         `, bindVars)
         const result = await cursor.next();
         //send out email to ticketholders if event was published
         if (showData.published) {
            let tickets = showData.soldTickets;
            let affectedEmails = []
            let affectedUIDs = []
            tickets.forEach((ticket) => {
               if (!affectedEmails.includes(ticket.email)) {
                  affectedEmails.push(ticket.email);
               } if (ticket.uid && !affectedUIDs.includes(ticket.uid)) {
                  affectedUIDs.push(ticket.uid);
               }
            })
            let start = ticketTimestamp(result.starttime);
            let newTime = start.date + " at " + start.time
            if (affectedEmails?.length > 0) {
               sendEmail("RESCHEDULE_NOTICE", affectedEmails, { showName: showData.name, newTime })
            }
            if (affectedUIDs?.length > 0) {
               dispatchNotification(affectedUIDs, 'SHOW_RESCHEDULED', { showID, newTime })
            }
         }
         return result;
      } else {
         throw new Error("PERMISSION_DENIED");
      }
   } catch (err) {
      throw err;
   }
}

export async function getVenuePermissions(venueID) {
   try {
      const bindVars = {
         venueID,
      }
      const cursor = await db.query(`
            FOR perm IN permissions
            FILTER perm.venueID == @venueID 
            return perm
            `, bindVars)
      const result = await cursor.next();
      return result;
   } catch (err) {
      throw err;
   }
}

export async function saveTicketProfile(venueID, profileName, profile) {
   try {
      const bindVars = {
         venueID,
         profileName,
         profile
      };
      await db.query(`
         FOR venue IN venues
         FILTER venue._key == @venueID
            UPDATE {_key: @venueID} WITH { ticketProfiles : {
            @profileName: @profile
            }
         } IN venues
   `, bindVars)
   } catch (err) {
      throw err;
   }
}

export async function getShowNotes(showID, venueID) {
   try {
      const showData = await checkShowOwnership(showID, venueID)
      if (showData) {
         return ({ showID: showID, notes: showData.notes || "", attachments: showData.attachments || [] });
      } else {
         throw new Error("PERMISSION_DENIED")
      }
   } catch (err) {
      throw err;
   }
}

export async function redeemTicket(showID, ticketID, redeemed, permissions) {
   try {
      const tickets = await getSoldTickets(showID);
      var status = Date.now()
      let ticket = tickets[ticketID];

      if (ticket) {
         console.log("ticket exists")
         if (ticket.redeemed && !redeemed && !permissions.CAN_MANAGE_GUESTLIST) {
            console.log(permissions, "recheck")
            return ("recheck")
         }
         const bindVars = {
            showID,
            ticketID,
            status: !redeemed ? status : false
         }
         console.log(!redeemed ? status : false)
         db.query(`
            FOR ticketInfo IN tickets
            FILTER ticketInfo.showID == @showID
            UPDATE {_key: ticketInfo._key} WITH {
               soldTickets: {
                  [@ticketID] : MERGE(ticketInfo.soldTickets[@ticketID], {redeemed: @status})
               }
            } IN tickets
            `, bindVars)
         return true
      } else {
         return false
      }

   } catch (err) {
      throw err;
   }
}

export async function sendSurefireInvites(artists, showID, venueID, notificationTargets) {
   try {
      const bindVars = { artists };
      const cursor = await db.query(`
      FOR artist IN users
      FILTER CONTAINS(@artists, artist._key)
      FILTER artist.type.artist.enabled == true && artist.type.artist.surefire.enabled == true && artist.type.artist.surefire.phone != NULL
      RETURN artist.type.artist.surefire.phone
   `, bindVars)
      let result = await cursor.all();
      notificationTargets.forEach((uid) => {
         dispatchNotification(uid, 'NEW_INVITE', { showID, venueID })
      })
      if (process.env.DISABLE_TWILIO !== true) {
         result.forEach((phone) => {
            const message = "You've received a Surefire Booking invite from TuneHatch! Log in to accept the gig";
            // this shouldn't be hard coded but it is for testing purposes -> update to tunehatch after testing
            //use public url for environment variable - for text send SECRETUID - route text-confirm/showID/SECRETUID
            const link = `${PUBLICURL}/manage-shows`;
            sendSMS(phone, message, link);
         })
      } else {
         console.log("Twilio disabled for resource conservation. This is where text messages would normally be sent.")
      }
   } catch (err) {
      console.log(err);
   }
}

export async function createShow(form) {
   try {
      var offPlatformArtistData = Array.isArray(form?.performers) ? form?.performers?.filter(((performer) => performer.id === 0 && performer.email)) : [];
      form.showrunner = form.showrunner || [];
      var offPlatformSRData = form.showrunner.filter((showrunner) => showrunner.id === 0 && showrunner.email);
      var surefireEnabled;
      var invites = []
      var performers = [];
      form = parseNestedData(form);
      if (offPlatformSRData.length > 0) {
         //todo: accomodate for multiple showrunners being added both on and off platform simultaneously
         form.showrunner = await generateOffPlatformShowrunner(form, offPlatformSRData)
      }

      let flyerData = form.flyer;

      form.venueID = Array.isArray(form.venueID) ? (await generateOffPlatformVenue(form.venueID[0]))?._key : form.venueID;
      
      if (flyerData) {
         let flyerPath = await uploadBaseImage(flyerData, "venue", form.venueID, Date.now())
         if (flyerPath) {
            form.flyer = flyerPath
         } else {
            throw new Error("SERVER_ERROR");
         }
      }
      //time conversion functions here
      // if (form.starttime) {
      //    form.starttime = convertTimestampToUTC(form.starttime);
      // }

      // if (form.endtime) {
      //    form.endtime = convertTimestampToUTC(form.endtime);
      // }
      //
      let inviteKeys = Object.keys(form.invites || {});
      let notificationTargets = [];
      if (inviteKeys?.length > 0) {
         let cleanedInvites = [];
         inviteKeys.forEach((inviteKey) => {
            cleanedInvites.push(form.invites[inviteKey]);
            notificationTargets.push(form.invites[inviteKey].uid);
         })
         form.invites = cleanedInvites;
         invites = cleanedInvites
      } else {
         invites = [];
         form.invites = [];
      }
      let performerKeys = Object.keys(form.performers || {});
      if (performerKeys?.length > 0) {
         let cleanedPerformers = [];
         performerKeys.forEach((performerKey) => {
            cleanedPerformers.push(form.performers[performerKey]);
         })
         performers = cleanedPerformers;
      } else {
         form.performers = [];
      }
      form.soldTickets = []
      form.remainingTickets = form.capacity
      form.published = false;
      if (form.meta.showType === "IKWP") {
         form.published = true;
         form.lineup_locked = true;
      } else {
         if (form.meta.showType === "Surefire") {
            surefireEnabled = true;
            form.lineup_locked = false
         }
         form.published = false;
         form.lineup_locked = false;
      }
      delete form.SECRET_UID;
      delete form.required_fields;
      delete form.submission_status
      delete form.needsTalent
      delete form.offPlatformData;

      let formData = parseNestedData(form)
      let metadata = formData.meta
      if (metadata.repeatNumber) {
         metadata.repeatNumber = Number(metadata.repeatNumber)
      }
      let deal = formData.deal
      delete formData.deal
      delete formData.meta;
      if (deal) {
         if (metadata && metadata.saveDeal) {
            saveDealProfile(form.venueID, deal, metadata)
         }
         if (deal.type && (!metadata?.repeatNumber > 1 || !metadata.repeatNumber)) {
            formData.dealID = await generateDealID(form.venueID, deal, form.performers)
         }
      }
      if (metadata?.saveProfile && metadata?.ticketProfileName) {
         saveTicketProfile(form.venueID, metadata.ticketProfileName, formData.ticket_tiers)
      }
      //handle repeating shows
      if (metadata?.repeatNumber > 1) {
         let repeatShows = [];
         // const initialStart = formData.starttime
         // const initialEnd = formData.endtime;
         console.log(formData.starttime)
         for (let i = 0; i < metadata.repeatNumber; i++) {
            if (i) {
               if (metadata.repeatType === "monthly") {
                  formData.starttime = getOrdinal(formData.starttime);
                  formData.endtime = getOrdinal(formData.endtime);
               } else {
                  // 604800000 = one week
                  formData.starttime = addToTimestamp(formData.starttime, 1, 'week')
                  console.log(formData.starttime)
                  formData.endtime = addToTimestamp(formData.endtime, 1, 'week')
               }
            }
            if (deal.type) {
               formData.dealID = await generateDealID(form.venueID, deal, form.performers)
            }
            let repeatingShowData = { ...formData }
            repeatShows.push(repeatingShowData)
         }
         const bindVars = {
            shows: repeatShows
         }
         const cursor = await db.query(`
         FOR show IN @shows
         INSERT show INTO shows
         RETURN NEW
         `, bindVars);
         const result = await cursor.all();
         for (const res of result) {
            if (res) {
               generatePerformerData(res._key, performers, invites, [], offPlatformArtistData);
            }
         }
         return result;
      } else {
         const bindVars = {
            show: formData,
         };
         const cursor = await db.query(`
     INSERT @show INTO shows
     RETURN NEW
     `, bindVars);
         const result = await cursor.next();
         if (result) {
            generatePerformerData(result._key, performers, invites, [], offPlatformArtistData)
            if (surefireEnabled) {
               sendSurefireInvites(inviteKeys, result._key, result.venueID, notificationTargets)
            }
         }
         return result;
      }
   } catch (err) {
      throw err;
   }
}


export async function updatePerformanceAgreement(venueID, agreement) {
   try {
      const bindVars = {
         venueID, agreement
      }
      let cursor = await db.query(`
         FOR venue IN venues
         FILTER venue._key == @venueID
            UPDATE {_key: @venueID} WITH {performanceAgreement: {
               agreement: @agreement
            }
         } IN venues
         RETURN NEW
      `, bindVars)
      const result = await cursor.next();
      return result
   } catch (err) {
      throw err;
   }
}

export async function editShowNotes(form, files) {
   try {

      for (let key in form) {
         if (key !== "SECRET_UID" && key !== "attachments_existingFileNames" && key !== "attachments_existingFilePaths") {
            form[key] = String(JSON.parse(form[key]))
         } else if (key === "attachments_existingFileNames" || key === "attachments_existingFilePaths") {
            form[key] = JSON.parse(form[key])
         }
      }
      let maxFiles = 3
      var attachments = new Array(maxFiles).fill(null);
      let formData = {
         notes: form.notes,
         attachments: attachments
      }
      const { venueID, showID } = form

      let tempFiles = Array();
      let i = 0
      if (files['attachments']?.length) {
         for await (const file of files['attachments']) {
            if (file && i < maxFiles) {
               let paths = await determineUploadPaths("venue", venueID, showID)
               let newFile = file.filename + path.extname(file.originalname).toLowerCase()
               let targetDir = paths.targetDir + '/' + newFile;
               let displayDir = paths.displayDir + '/' + newFile;
               await renameSync(file.path, targetDir)
               tempFiles[i] = {
                  name: file.originalname,
                  location: displayDir
               };
               formData.attachments[i] = tempFiles[i];
            }
            i = i + 1;
         }
      }
      if (form.attachments_existingFilePaths) {
         let j = 0
         for (const file of form.attachments_existingFilePaths) {
            if (file && i < maxFiles) {
               formData.attachments[i] = {
                  name: form.attachments_existingFileNames[j],
                  location: form.attachments_existingFilePaths[j],
               }
            }
            i = i + 1;
            j = j + 1
         }
      }

      const bindVars = { venueID: venueID, showID: showID, formData }
      const cursor = await db.query(`
            FOR show IN shows
            FILTER show._key == @showID && show.venueID == @venueID
            UPDATE {_key: show._key} WITH @formData IN shows
            RETURN NEW
         `, bindVars)
      const editedShow = await cursor.next()
      return (editedShow);
   } catch (err) {
      throw err;
   }
}

export async function editShow(form) {
   try {
      const { showID, venueID } = form;
      var show;
      var offPlatformSRData;
      delete form.showID;
      delete form.venueID;
      delete form.SECRET_UID;
      form = parseNestedData(form);
      if (form.showrunner) {
         form.showrunner = form.showrunner || [];
         offPlatformSRData = form?.showrunner?.filter((showrunner) => showrunner.id === 0 && showrunner.email) || null;
      }
      if (form.showrunner.length > 0 && offPlatformSRData.length > 0) {
         show = getSingleDocument("shows", showID);
         generateOffPlatformShowrunner(showID, show)
      }
      const bindVars = { venueID, showID: showID, form }
      const cursor = await db.query(`
            FOR show IN shows
            FILTER show._key == @showID && show.venueID == @venueID
            UPDATE {_key: show._key} WITH @form IN shows
            RETURN NEW
         `, bindVars)
      const editedShow = await cursor.next()
      return (editedShow);
   } catch (err) {
      throw err;
   }
}

export async function deleteShow(showID, venueID) {
   try {
      const bindVars = {
         showID,
         venueID
      }
      await db.query(`
         FOR show IN shows
         FILTER show._key == @showID && show.venueID == @venueID
         UPDATE {_key: @showID, "deleted": true} IN shows
         `, bindVars)
      return showID;
   } catch (err) {
      throw err;
   }
}

export async function saveDeal(form) {
   try {
      delete form.required_fields;
      delete form.submission_status
      delete form.needsTalent
      let formData = parseNestedData(form)
      let metadata = formData.metadata
      let deal = formData.deal
      if (deal && metadata.saveDeal) {
         let sDeal = {}
         //save deal profile to venue for future use
         sDeal.type = deal.type;
         sDeal.name = metadata.dealName;
         sDeal.type = "ticket_split"
         sDeal.label = metadata.dealName
         sDeal.options = deal.options
         sDeal.defaults = deal.defaults
         const makeDefault = metadata.defaultDeal
         const bindVars = {
            venueID: formData.venueID,
            dealName: metadata.dealName,
            deal: sDeal,
            makeDefault
         }
         const cursor = await db.query(`
               FOR venue IN venues
               FILTER venue._key == @venueID
               UPDATE {_key: @venueID} WITH {
                  dealProfiles : {
                     @dealName: @deal
                  },
                  defaultDeal: @makeDefault ? @dealName : venue.defaultDeal
               } IN venues
               RETURN NEW
               `, bindVars)
         const result = await cursor.next();
         return ({ ...result, lastUpdated: sDeal.name });
      } else {
         throw new Error("PERMISSION_DENIED")
      }
   } catch (err) {
      throw err;
   }
}
