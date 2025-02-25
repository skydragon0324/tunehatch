import { renameSync, unlinkSync } from "fs";
import { OWNER_DEFAULT_PERMISSIONS } from "../../../src/Helpers/shared_dist/permissionsConfig.js";
import { db } from "../../Config/db.config.js";
import { createStripe } from "../apiService.js";
import { permCheck, parseNestedData, encryptUID } from "../cleaningService.js";
import {
    determineUploadPaths,
    uploadBaseImage,
    verifyUpload,
} from "../imageServices.js";
import {
    checkShowOwnership,
    checkVenuePermissions,
    createUnmannedUser,
    emailUserLookup,
    getSingleDocument,
    getSingleShow,
    refreshIO,
} from "./dbHelperService.js";
import path from "path";
import { dispatchNotification } from "./dbService.js";
import { returnPerformersString } from "../../Models/Shows.js";
import { ticketTimestamp } from "../../../src/Helpers/shared_dist/ticketTimestamp.js";
import { fileURLToPath } from "url";
import { sendSMS } from "../commsService.js";
import { PUBLICURL } from "../../Config/config.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var io;
export async function publishShow(form) {
    try {
        const eventID = form.eventID;
        let flyerData = form.flyer;
        if (flyerData) {
            let flyerPath = await uploadBaseImage(
                flyerData,
                "venue",
                form.venueID,
                Date.now()
            );
            if (flyerPath) {
                form.flyer = flyerPath;
            } else {
                throw new Error("SERVER_ERROR");
            }
        }
        form.published = true;
        form.lineup_locked = true;
        delete form.SECRET_UID;
        delete form.eventID;
        delete form.required_fields;
        delete form.submission_status;

        const bindVars = {
            show: form,
            eventID,
        };
        const cursor = await db.query(
            `
          FOR event IN shows
          UPDATE {_key: @eventID} WITH @show IN shows
          RETURN NEW
      `,
            bindVars
        );
        const result = await cursor.next();
        return result;
    } catch (err) {
        throw err;
    }
}

export async function getConversations(uid, venueIDs) {
    try {
        const searchParams = [...venueIDs, uid];
        const bindVars = { searchParams };
        const cursor = await db.query(
            `
       FOR conversation IN conversations
       FILTER conversation.participants ANY IN @searchParams
       SORT LAST(conversation.messages).timestamp DESC
       RETURN conversation
    `,
            bindVars
        );
        const conversations = await cursor.all();
        return conversations;
    } catch (err) {
        throw err;
    }
}

export async function getShowSocialStatus(showID){
    try{
        const bindVars = {
            showID,
            shareStatus
        }
        const cursor = await db.query(`
            FOR show IN shows
            FILTER show._key == @showID
            RETURN {shareStatus: show.shareStatus}
        `, bindVars)
        console.log((await cursor.next()).shareStatus)
        return (await cursor.next()).shareStatus;
    }catch(err){
        throw err;
    }
}

export async function updateShowSocialStatus(showID, shareStatus){
    try{
        const bindVars = {
            showID,
            shareStatus
        }
        await db.query(`
            FOR show IN shows
            FILTER show._key == @showID
            UPDATE {_key: @showID} WITH {
                shareStatus: @shareStatus
            } IN shows
        `, bindVars)
            return true;
    }catch(err){
        throw err;
    }
}

export async function getShowPerformers(showID) {
    try {
        const bindVars = {
            showID,
        };
        const cursor = await db.query(
            `
        FOR perf IN performances
        FILTER perf.status == "accepted" && perf.showID == @showID
        RETURN {
            uid: perf.uid ? perf.uid : perf.id,
            id: perf.id,
            showID: perf.showID,
            type: perf.type,
            status: perf.status,
            timestamp: perf.timestamp
          }
        `,
            bindVars
        );
        const result = await cursor.all();
        return result;
    } catch (err) {
        throw err;
    }
}

export async function markReadMessage(uid, participants, responseID) {
    try {
        let verified;
        if (participants.includes(uid)) {
            verified = true;
        } else {
            verified = await checkVenuePermissions(
                uid,
                responseID,
                "CAN_MESSAGE"
            );
        }
        if (verified) {
            const bindVars = { responseID, participants };
            const cursor = await db.query(
                `
             FOR convo IN conversations
             FILTER convo.participants == @participants && POSITION(convo.participants, @responseID)
             UPDATE {
                _key: convo._key,
                seenBy: APPEND(convo.seenBy, @responseID, true)
             } IN conversations
             RETURN convo._key
          `,
                bindVars
            );
            const result = await cursor.next();
            return result;
        } else {
            throw new Error("PERMISSION_DENIED");
        }
    } catch (err) {
        throw err;
    }
}

export async function sendMessage(uid, participants, responseID, content) {
    io = refreshIO(io);
    try {
        let verified = false;
        console.log(participants, uid, responseID)
        if (participants.includes(uid)) {
            verified = true;
        } else {
            verified = await checkVenuePermissions(
                uid,
                responseID,
                "CAN_MESSAGE"
            );
        }
        if (verified) {
            const timestamp = Date.now();
            const bindVars = { responseID, participants, content, timestamp };
            const cursor = await db.query(
                `
       UPSERT { participants: @participants } 
       INSERT { 
          participants: @participants,
          seenBy: [@responseID],
          messages: [{
             sender: @responseID,
             content: @content,
             timestamp: @timestamp
          }]
        } 
       UPDATE { 
          seenBy: [@responseID],
          messages: PUSH(OLD.messages, {
             sender: @responseID,
             content: @content,
             timestamp: @timestamp
          })
       } IN conversations
       RETURN NEW
       `,
                bindVars
            );
            const result = await cursor.all();
            io.sockets.in(participants).emit("NEW_MESSAGE", { ...result[0] });
            return result;
        } else {
            throw new Error("PERMISSION_DENIED");
        }
    } catch (err) {
        throw err;
    }
}

/** verifyPerformance
 * Verifies artist's invite status for a given show
 * @param {_key} showID
 * @param {_key} artistID
 */

export async function verifyPerformance(showID, artistID) {
    try {
        const bindVars = {
            showID,
            artistID,
        };
        const cursor = await db.query(
            `
            FOR perf IN performances
            FILTER perf._to == CONCAT("shows/", @showID) && perf._from == CONCAT("users/", @artistID)
            RETURN {
                uid: perf.uid ? perf.uid : perf.id,
                id: perf.id,
                showID: perf.showID,
                type: perf.type,
                status: perf.status,
                timestamp: perf.timestamp
              }        
        `,
            bindVars
        );
        const result = await cursor.next();
        return result || {};
    } catch (err) {
        throw err;
    }
}

/**
 * respondToPerformance
 * Allows venues and artists to accept/reject invites
 * @param {_key} uid User's displayUID
 * @param {_key} artistID Artist's DisplayID
 * @param {_key} showID Show ID
 * @param {str} status accept | reject
 * @param {_key} verified (optional) Required if venue
 */
export async function respondToPerformance(
    type,
    uid,
    artistID,
    showID,
    status,
    verified,
    hasTextContactEnabled,
) {
    try {
        if (!verified) {
            verified = false;
        }

        if (
            uid &&
            artistID &&
            showID &&
            (status === "accepted" || status === "rejected")
        ) {
            const show = await getSingleDocument("shows", showID);
            if (show.lineup_locked) {
                throw new Error("LINEUP_LOCKED");
            }
            if (status === "accepted" && (type === "industry" || type === "venue") && hasTextContactEnabled) {
                const venue = await getSingleDocument("venues", show.venueID);
                try {
                    const bindVars = {
                        artistID,
                        showID
                    }
                    const cursor = await db.query(`
                    UPSERT { _from: CONCAT("users/", @artistID), _to: CONCAT("shows/", @showID) } 
                    INSERT { 
                        _to: CONCAT("shows/", @showID),
                        _from: CONCAT("users/", @artistID), 
                        uid: @artistID,
                        showID: @showID,
                        type: "invite",
                        status: "pending",
                        timestamp: DATE_NOW()
                    } 
                    UPDATE { 
                        type: "invite",
                        status: "pending"
                    } IN performances
                    RETURN {
                        uid: NEW.uid,
                        id: NEW.id,
                        showID: NEW.showID,
                        type: NEW.type,
                        status: NEW.status,
                        timestamp: NEW.timestamp,
                        phone: NEW.phone
                      }
                    `, bindVars)
                    const result = await cursor.next();
                    if(status === "accepted" && result.phone){
                        const ARTIST_SECRET_UID = encryptUID(result.id || result.uid);
                        sendSMS(result.phone, `${venue.name} has accepted your application to play a show. One-click confirmation:`, `${PUBLICURL}/qc/${ARTIST_SECRET_UID}/${showID}`)
                    }
                    return result;
                }catch(err){
                    throw err;
                }
            } else {
                const bindVars = {
                    uid,
                    artistID,
                    verified,
                    showID,
                    status,
                };
                const cursor = await db.query(
                    `
                    FOR perf IN performances
                    FILTER (perf._from == CONCAT("users/", @artistID) && perf._to == CONCAT("shows/", @showID)) && ((perf.type == "invite" && @artistID == @uid) || (perf.type == "application" && @verified == true))
                    UPDATE {_key: perf._key} WITH {status: @status} IN performances
                    RETURN {
                        uid: NEW.uid,
                        id: NEW.id,
                        showID: NEW.showID,
                        type: NEW.type,
                        status: NEW.status,
                        timestamp: NEW.timestamp
                      }
                `,
                    bindVars
                );
                const result = await cursor.next();
                if (!result) {
                    console.log('No matching document found');
                    return {showID: showID};
                }
                return result;
            }
            
        } else {
            throw new Error("SERVER_ERROR");
        }
    } catch (err) {
        throw err;
    }
}

/**
 * handleIncomingSMSResponse
 * @param {string} messageBody This should be either a YES or NO reply from the artist confirming their performance
 * @param {_key} uid User's DisplayUID
 * @param {_key} showID showID for performance
 * @param {string} venuePhone required to text the venue
 * @param {string} artistName required for text
 * @param {object} showDate required for text
 * @param {string} artistPhone required for text response
 */

/**
 * loadDeal
 * Returns deal. If type is partial, returns only details relevant to user. If venue manager requests full, will return all deal details.
 * @param {bool} fullDeal If manager is requesting, returns full deal if true. Otherwise, returns partial deal, with details relevant to user.
 * @param {_key} uid User's DisplayUID
 * @param {_key} dealID Requested dealID
 * @param {_key} permissions (optional) Required if requesting full deal.
 */
export async function loadDeal(fullDeal, uid, dealID, permissions) {
    try {
        if (dealID) {
            const deal = await getSingleDocument("deals", dealID);
            let reqDeal = {
                dealID: deal._key,
                venueID: deal.venueID,
                type: deal.type,
                defaults: deal.defaults,
                deals: {},
            };
            if (!fullDeal) {
                if (uid && fullDeal?.deals?.[uid]) {
                    reqDeal.deals[uid] = fullDeal.deals[uid];
                } else if (uid) {
                    reqDeal.deals[uid] = fullDeal.defaults;
                } else {
                    throw new Error("UID_ERROR");
                }
                return reqDeal;
            } else {
                permCheck(["CAN_SEE_DEALS"], permissions);
                return deal;
            }
        } else {
            return {};
        }
    } catch (err) {
        throw err;
    }
}

export async function cancelBooking(
    uid,
    displayUID,
    showID,
    artistID,
    artistName,
    permissions
) {
    console.log('IN dbINdurty, cancel booking', showID);

    try {
        console.log(displayUID !== artistID);
        console.log('IN dbINdurty 1', showID);
        if ((displayUID || uid) !== artistID) {
            permCheck(["CAN_BOOK_SHOW"], permissions);
        }
        const bindVars = {
            showID,
            artistID: artistID || "undefined",
            artistName: artistName || null,
        };
        await db.query(
            `
        FOR performance IN performances
        FILTER performance._to == CONCAT("shows/", @showID) && performance._from == CONCAT("users/", @artistID) && (performance.name == @artistName || !performance.name)
        UPDATE {_key: performance._key} WITH {
            status: "cancelled"
        } IN performances
        RETURN {
            uid: NEW.uid,
            id: NEW.id,
            showID: NEW.showID,
            type: NEW.type,
            status: NEW.status,
            timestamp: NEW.timestamp
          }
        `,
            bindVars
        );
        console.log('IN dbINdurty', showID);
        return { _key: showID, removed: artistID, removedName: artistName };
    } catch (err) {
        console.log('ERROR');
        throw err;
    }
}

export async function createNewVenue(uid, form, files) {
    try {
        let maxImages = 3;
        delete form.SECRET_UID;
        let formImages = form.images || [];
        delete form.images;
        for (let key in form) {
            try {
                form[key] = JSON.parse(form[key]);
            } catch {}
        }
        form.hosts = [uid].filter(x => x != null);
        form.video = null;
        delete form.required_fields;
        delete form.submission_status;

        let formData = parseNestedData(form);
        const bindVars = {
            venue: formData,
        };
        const cursor = await db.query(
            `
       INSERT @venue INTO venues
      RETURN NEW
      `,
            bindVars
        );
        const result = await cursor.next();
        let mediaAvatar = null;
        let mediaBanner = null;
        let mediaImages = [null, null, null];
        if (files["avatar"]) {
            let file = files["avatar"][0];
            if (verifyUpload(file)) {
                let paths = await determineUploadPaths("venue", result._key);
                let newFile =
                    file.filename +
                    path.extname(file.originalname).toLowerCase();
                let targetDir = paths.targetDir + newFile;
                let displayDir = paths.displayDir + newFile;
                await renameSync(file.path, targetDir);
                mediaAvatar = displayDir;
            } else {
                unlinkSync(file.path);
            }
        }
        //ARRAY UPLOADING LOGIC
        var newImages = 0;
        var allImages = 0;
        for (var image of formImages) {
            console.log(image);
            if (image === "newImage") {
                if (files["images"]) {
                    let newImage = files["images"][newImages];
                    console.log(newImage, "new img");
                    if (newImage && verifyUpload(newImage)) {
                        let paths = await determineUploadPaths(
                            "venue",
                            result._key
                        );
                        let newFile =
                            newImage.filename +
                            path.extname(newImage.originalname).toLowerCase();
                        let targetDir = paths.targetDir + newFile;
                        let displayDir = paths.displayDir + newFile;
                        console.log(newImage.path, targetDir);
                        await renameSync(newImage.path, targetDir);
                        image = displayDir;
                    } else {
                        // unlinkSync(newImage.path);
                        image = null;
                    }
                } else {
                    image = null;
                }
                newImages = newImages + 1;
            } else {
                image = image !== "null" && image !== null ? image : null;
            }
            formImages[allImages] = image;
            allImages = allImages + 1;
        }
        mediaImages = formImages;
        //ARRAY UPLOADING LOGIC END
        if (files["banner"]) {
            let file = files["banner"][0];
            if (verifyUpload(file)) {
                let paths = await determineUploadPaths("venue", result._key);
                let newFile =
                    file.filename +
                    path.extname(file.originalname).toLowerCase();
                let targetDir = paths.targetDir + newFile;
                let displayDir = paths.displayDir + newFile;
                await renameSync(file.path, targetDir);
                mediaBanner = displayDir;
            } else {
                console.log("Banner upload failed for venue");
                unlinkSync(file.path);
            }
        }

        let mediaVars = {
            venueID: result._key,
            avatar: mediaAvatar,
            banner: mediaBanner,
            images: mediaImages,
        };

        const updatedVenueCursor = await db.query(
            `FOR venue IN venues 
            FILTER venue._key == @venueID
            UPDATE {_key: @venueID} WITH 
            {
                avatar: @avatar,
                banner: @banner,
                images: @images,
            } IN venues 
            RETURN venue`,
            mediaVars
        );

        const updatedVenue = await updatedVenueCursor.next();

        let ownershipVars = {
            key: uid,
            venueID: result._key,
            permissions: OWNER_DEFAULT_PERMISSIONS,
        };

        await db.query(
            `INSERT {
             venueID: @venueID,
             [@key]: @permissions
          } INTO permissions`,
            ownershipVars
        );

        createStripe(uid, result._key);
        return updatedVenue;
    } catch (err) {
        throw err;
    }
}

/**
 * addConfirmedArtists
 * Adds confirmed artists directly to roster, bypassing normal invite process.
 * @param {_key} showID
 * @param {Object} performers UIDs of performers
 */
export async function addConfirmedArtists(
    showID,
    venueID,
    performers,
) {
    const show = await getSingleDocument("shows", showID);
    var offPlatformArtistData = performers?.filter(((performer) => performer.id === 0 && performer.email)) || [];
    if (show.venueID === venueID) {
        const performerKeys = Object.keys(performers);
        if (performerKeys?.length > 0) {
            let cleanedPerformers = [];
            performerKeys.forEach((performerKey) => {
                cleanedPerformers.push(performers[performerKey]);
            });
            performers = cleanedPerformers;
            await generatePerformerData(
                showID,
                performers,
                [],
                [],
                offPlatformArtistData,
            );
            const cleanedShow = await getSingleShow(showID);
            return cleanedShow;
        } else {
            return false;
        }
    } else {
        throw new Error("SHOW_OWNER_MISMATCH");
    }
}

/**
 * generateOffPlatformShowrunner
 * Creates/Updates and links performer data to a show.
 * @param {object} show Show form object
 * @param {Object} offPlatformData Showrunner object from FilterInput
 */
export async function generateOffPlatformShowrunner(show, offPlatformData) {
    try {
        let venue;
        let showTime;
        if (offPlatformData) {
            console.log(offPlatformData, "offPlatformData true");
            venue = await getSingleDocument("venues", show.venueID);
            showTime = ticketTimestamp(show.starttime);
            showTime = showTime.date + " at " + showTime.time;

            // Handle showrunners separately
            let i = 0;
            for (const opData of offPlatformData) {
                if (opData.type === "showrunner") {
                    console.log("showrunner");
                    const showrunner = await createUnmannedUser(
                        "showrunner",
                        {
                            opData,
                        },
                        {
                            venueEmail: venue?.contact?.email,
                            venueName: venue?.name,
                            showTime,
                            showID: show._key,
                        }
                    );
                    offPlatformData[i].id = showrunner;
                }
                i = i + 1;
            }
        }
        return offPlatformData || [];
    } catch (err) {
        console.log(err);
        console.log("Failed to send performance data");
    }
}

/**
 * generateOffPlatformVenue
 * Creates/Updates and links venue data to a show.
 * @param {object} show Show form object
 * @param {Object} offPlatformData Venue object from FilterInput
 */
export async function generateOffPlatformVenue(offPlatformData) {
    return await createNewVenue(null, offPlatformData, {});
}

/**
 * generatePerformerData
 * Creates/Updates and links performer data to a show.
 * @param {_key} showID
 * @param {Array} performers
 * @param {Array} invites
 * @param {Array} applications
 * @param {Object} offPlatformData
 */
export async function generatePerformerData(
    showID,
    performers,
    invites,
    applications,
    offPlatformData
) {
    try {
        let show;
        let venue;
        let showTime;
        if (offPlatformData) {
            show = await getSingleDocument("shows", showID);
            try {
                venue = await getSingleDocument("venues", show.venueID);
            } catch (err) {
                console.error('Error getting venue:', err);
            }
        }
        showTime = ticketTimestamp(show.starttime);
        showTime = showTime.date + " at " + showTime.time;
        var perfData = [];
        console.log(performers, "performers");
        // handle performers
        for (const performer of performers) {
            if (performer) {
                console.log("performer found");
                let ind = {
                    _to: "shows/" + showID,
                    _from: "users/" + (performer.id || performer.uid),
                    uid: performer.id || performer.uid,
                    name: performer.name,
                    showID: showID,
                    type: "invite",
                    status: "accepted",
                };
                if (!ind.name) {
                    delete ind.name;
                }
                console.log(performer.id);
                console.log(ind);
                if (performer.id === 0) {
                    if (performer.email) {
                        console.log("0 performer UID with email");
                        let emailLookup = await emailUserLookup(
                            performer.email
                        );
                        if (emailLookup) {
                            console.log("email lookup returned result");
                            ind._from = "users/" + emailLookup._key;
                            ind.id = emailLookup._key;
                        } else {
                            let pData = performer;
                            if (performer.type === "artist") {
                                pData.stagename = performer.name;
                                delete pData.name;
                                console.log(pData);
                            }

                            const pUID = await createUnmannedUser(
                                "artist",
                                pData,
                                {
                                    venueEmail: venue?.contact?.email,
                                    venueName: venue?.name,
                                    showTime,
                                    showID,
                                    cohost: show?.cohosted,
                                    show,
                                    boweryVault:
                                        show?.venueID === "3060099" ||
                                        show?.venueID === "17857582",
                                }
                            );
                            ind._from = "users/" + pUID;
                            ind.id = pUID;
                        }
                    }
                    ind.name = performer.name;
                }

                perfData.push(ind);
            }
        }
        invites.forEach((performer) => {
            perfData.push({
                _to: "shows/" + showID,
                _from: "users/" + (performer.id || performer.uid),
                uid: performer.id || performer.uid,
                showID: showID,
                type: "invite",
                status: "pending",
            });
        });
        applications.forEach((performer) => {
            perfData.push({
                _to: "shows/" + showID,
                _from: "users/" + (performer.id || performer.uid),
                uid: performer.id || performer.uid,
                showID: showID,
                type: "application",
                status: "pending",
            });
        });
        const bindVars = {
            perfData,
        };
        const cursor = await db.query(
            `
       FOR perf IN @perfData
       UPSERT { _from: perf._from, _to: perf._to, name: perf.name }
         INSERT perf
         UPDATE { 
             type: perf.type,
             status: perf.status
         } IN performances
         RETURN {
            uid: NEW.uid,
            id: NEW.id,
            showID: NEW.showID,
            type: NEW.type,
            status: NEW.status,
            timestamp: NEW.timestamp
          }
       `,
            bindVars
        );
        const result = await cursor.next();
        return { showID, result };
    } catch (err) {
        console.log(err);
        console.log("Failed to send performance data");
    }
}

export async function inviteArtists(form) {
    try {
        const { showID, venueID, invites, dealOptions } = form;
        let perfInvites;
        let showData = await checkShowOwnership(showID, venueID);
        if (showData) {
            //update deal
            const dealID = showData.dealID;
            if (dealOptions && dealID) {
                let newDeals = dealOptions.deals;
                const dealVars = {
                    dealID,
                    newDeals,
                };
                await db.query(
                    `
                FOR deal IN deals
                FILTER deal._key == @dealID
                UPDATE {_key: @dealID} WITH {deals: @newDeals}
                IN deals
             `,
                    dealVars
                );
            }
            let notificationTargets = [];
            let inviteKeys = Object.keys(invites || {});
            if (inviteKeys?.length > 0) {
                let cleanedInvites = [];
                inviteKeys.forEach((inviteKey) => {
                    cleanedInvites.push(invites[inviteKey]);
                    notificationTargets.push(invites[inviteKey].uid);
                });
                perfInvites = cleanedInvites;
            } else {
                form.invites = [];
            }
            const perfData = await generatePerformerData(
                showData._key,
                [],
                perfInvites,
                []
            );
            notificationTargets.forEach((uid) => {
                dispatchNotification(uid, "NEW_INVITE", { showID, venueID });
            });
            return perfData;
        } else {
            throw new Error("PERMISSION_DENIED");
        }
    } catch (err) {
        throw err;
    }
}

export async function updateShowFlyer(form) {
    try {
        form = parseNestedData(form);
        let flyerPath;
        const { venueID, showID, flyer } = form;

        if (flyer) {
            flyerPath = await uploadBaseImage(
                flyer,
                "venue",
                venueID,
                Date.now()
            );
            if (!flyerPath) {
                throw new Error("SERVER_ERROR");
            }
            const bindVars = {
                showID,
                flyerPath,
            };
            const cursor = await db.query(
                `
                FOR show IN shows
                FILTER show._key == @showID
                UPDATE {_key: @showID} WITH {flyer: @flyerPath}
                IN shows 
                RETURN {_key: show._key, flyer: show.flyer}
            `,
                bindVars
            );
            const result = await cursor.next();
            return result;
        } else {
            throw new Error("NO_FLYER_PROVIDED");
        }
    } catch (err) {
        throw err;
    }
}

export async function updateShowFlyer_old(form, files) {
    try {
        for (let key in form) {
            if (key !== "SECRET_UID") {
                form[key] = JSON.parse(form[key]);
            }
        }
        let flyerPath;
        const show = await getSingleDocument("shows", form.showID);
        if (show._key && show.flyer) {
            flyerPath = path.join(__dirname + "/../../../", show.flyer);
            const flyerData = files["newFlyer"]?.[0];
            if (verifyUpload(flyerData)) {
                await renameSync(flyerData.path, flyerPath);
            } else {
                unlinkSync(flyerData.path);
                throw new Error("INVALID_IMAGE");
            }
            return "Flyer successfully uploaded!";
        } else {
            throw new Error("NOT_FOUND");
        }
    } catch (err) {
        throw err;
    }
}

/**
 * toggleLineupLock
 * Toggles the lock for a show
 * @param {_key} showID
 * @param {bool} status
 */
export async function toggleLineupLock(showID, venueID, status) {
    try {
        const bindVars = {
            showID,
            status,
            venueID,
        };
        const cursor = await db.query(
            `
       FOR show IN shows
       FILTER show._key == @showID && show.venueID == @venueID
          UPDATE {
             _key: show._key
          } WITH {
             lineup_locked: @status
          } IN shows
          RETURN MERGE(NEW, ${returnPerformersString})
       `,
            bindVars
        );
        const result = await cursor.next();
        return result;
    } catch (err) {
        throw err;
    }
}

export async function updateShowDescription(showID, description) {
    try {
        const bindVars = { showID, description };
        const cursor = await db.query(
            `
        FOR show IN shows
        FILTER show._key == @showID
        UPDATE {
            _key: show._key
        } WITH {
            description: @description
        } IN shows
        RETURN MERGE(NEW, ${returnPerformersString})
        `,
            bindVars
        );
        const result = await cursor.next();
        return result;
    } catch (err) {
        throw err;
    }
}

/**
 * respondToShowrunner
 * Response to showrunner application
 * @param {_key} uid User's displayUID
 * @param {_key} artistID Artist's DisplayID
 * @param {_key} showID Show ID
 * @param {str} status accept | reject
 * @param {_key} verified (optional) Required if venue
 */
export async function respondToShowrunner(uid, SRID, showID, status, verified) {
    //todo: verification
    verified = true;
    if (
        uid &&
        SRID &&
        showID &&
        (status === "accepted" || status === "rejected")
    ) {
        const show = await getSingleDocument("shows", showID);
        if (show.lineup_locked) {
            throw new Error("LINEUP_LOCKED");
        }
        const bindVars = {
            SRID,
            verified,
            showID,
            status,
        };
        const cursor = await db.query(
            `
            FOR perf IN performances
            FILTER perf._from == CONCAT("showrunners/", @SRID) && perf._to == CONCAT("shows/", @showID) && perf.type == "application" && @verified == true
            UPDATE {_key: perf._key} WITH {status: @status} IN performances
            UPDATE {_key: @showID} WITH {
                "showrunner": @status == "accepted" ? [{
                "uid": @SRID
              }] : OLD.showrunner} IN shows
            RETURN NEW
        `,
            bindVars
        );
        const result = await cursor.next();
        return result;
    } else {
        throw new Error("SERVER_ERROR");
    }
}

/**
 * showrunnerApply
 * Used for a showrunner to apply for a gig
 * @param {key} showID
 * @param {key} SRID
 */
export async function showrunnerApply(showID, SRID, phone) {
    try {
        const bindVars = {
            SRID,
            showID,
            phone
        };
        const cursor = await db.query(
            `
        UPSERT { _from: CONCAT("showrunners/", @SRID), _to: CONCAT("shows/", @showID) } 
        INSERT { 
            _to: CONCAT("shows/", @showID),
            _from: CONCAT("showrunners/", @SRID), 
            id: @SRID,
            showID: @showID,
            phone: @phone,
            type: "application",
            showrunner: true,
            status: "pending",
            timestamp: DATE_NOW()
        } 
        UPDATE { 
            type: "application",
            status: "pending"
        } IN performances
        RETURN {
            uid: NEW.uid,
            id: NEW.id,
            showID: NEW.showID,
            type: NEW.type,
            status: NEW.status,
            timestamp: NEW.timestamp
          }
        `,
            bindVars
        );
        const result = await cursor.next();
        return result;
    } catch (err) {
        throw err;
    }
}
