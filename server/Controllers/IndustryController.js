import { checkVenuePermissions, getManagedVenueIDs, getSingleShow } from "../Services/DBServices/dbHelperService.js"
import { loadDeal, getConversations, markReadMessage, sendMessage, cancelBooking, createNewVenue, toggleLineupLock, addConfirmedArtists, inviteArtists, updateShowFlyer, publishShow, respondToPerformance, updateShowDescription, respondToShowrunner, getShowSocialStatus, updateShowSocialStatus } from "../Services/DBServices/dbIndustryService.js"
import { getStripe } from "../Services/apiService.js"
import { parseNestedData, permCheck } from "../Services/cleaningService.js"
import { checkCashLedger, updateCashLedger } from "../Services/DBServices/dbFinanceService.js"
import { generateBlankCashLedger } from "../Models/CashLedger.js"
import { uploadBaseImage } from "../Services/imageServices.js"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { CronJob } from 'cron';
import { dispatchNotification } from "../Services/DBServices/dbService.js"

const _loadDeal = async (req, res, next) => {
    try {
        const deal = await loadDeal(req.body.fullDeal, res.locals.uid, req.body.dealID, res.locals.permissions)
        res.send(deal)
    } catch (err) {
        next(err)
    }
}
export { _loadDeal as loadDeal }

export async function stripeRequest(req, res, next) {
    try {
        switch (req.body.viewType) {
            case "artist":
                if (req.body.targetID !== res.locals.uid) {
                    throw new Error("PERMISSION_DENIED");
                }
                break;
            case "venue":
                const PERMISSION = "CAN_MANAGE_PAYOUTS";
                console.log(res.locals.permissions)
                if (req.body.targetID && !res.locals.permissions[PERMISSION]) {
                    throw new Error("PERMISSION_DENIED")
                }
                break;
            case "showrunner":
                //todo: additional showrunner perms
                break;
        }
        var accountLink = await getStripe(req.body.viewType, req.body.stripeID, req.body.targetID)
        res.send(accountLink);
    } catch (err) {
        next(err)
    }
}

const _getConversations = async (req, res, next) => {
    try {
        const venueIDs = await getManagedVenueIDs(res.locals.uid)
        let messageList = []
        for (const venueID of venueIDs) {
            if (await checkVenuePermissions(res.locals.uid, venueID, "CAN_MESSAGE")) {
                messageList.push(venueID)
            }
        }
        const conversations = await getConversations(res.locals.uid, messageList)
        res.send(conversations)
    } catch (err) {
        next(err)
    }
}
export { _getConversations as getConversations }

const _markReadMessage = async (req, res, next) => {
    try {
        const messageData = await markReadMessage(res.locals.uid, req.body.participants, req.body.responseID)
        res.send(messageData)
    } catch (err) {
        next(err)
    }
}
export { _markReadMessage as markReadMessage }

const _sendMessage = async (req, res, next) => {
    try {
        const messageData = await sendMessage(res.locals.uid, req.body.participants, req.body.responseID?.id, req.body.value)
        res.send(messageData)
    } catch (err) {
        next(err)
    }
}
export { _sendMessage as sendMessage }

const _cancelBooking = async (req, res, next) => {
    try {
        const bookingData = await cancelBooking(req.body.uid, req.body.displayUID, req.body.showID, req.body.artistID, req.body.artistName, res.locals.permissions)
        res.send(bookingData)
    } catch (err) {
        next(err)
    }
}
export { _cancelBooking as cancelBooking }

const _createNewVenue = async (req, res, next) => {
    try {
        const venue = await createNewVenue(res.locals.uid, req.body, req.files)
        res.send(venue)
    } catch (err) {
        next(err)
    }
}
export { _createNewVenue as createNewVenue }

const _toggleLineupLock = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_BOOK_SHOW"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        const show = await toggleLineupLock(req.body.showID, req.body.venueID, req.body.status);
        res.send(show);
    } catch (err) {
        next(err)
    }
}
export { _toggleLineupLock as toggleLineupLock }

const _addConfirmedArtists = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_BOOK_SHOW"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        const show = await addConfirmedArtists(req.body.showID, req.body.venueID, req.body.performers);
        res.send(show);
    } catch (err) {
        next(err);
    }
}

export { _addConfirmedArtists as addConfirmedArtists }


const _inviteArtists = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_BOOK_SHOW"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        const result = await inviteArtists(req.body.form);
        res.send(result);
    } catch (err) {
        next(err);
    }
};
export { _inviteArtists as inviteArtists };

const _updateShowFlyer = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_UPDATE_FLYER"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        const status = await updateShowFlyer(req.body);
        res.send(status);
    } catch (err) {
        next(err);
    }
};
export { _updateShowFlyer as updateShowFlyer };

const _publishShow = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_PUBLISH_SHOW"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        const show = await publishShow(req.body.form);
        res.send(show);
    } catch (err) {
        next(err);
    }
};
export { _publishShow as publishShow };

const _flyerShare = async (req, res, next) => {
    console.log("Flyer sharing initiated...")
    try {
        const { showID, shareToFB, shareToIG, igid, fbid, schedule, accessToken } = req.body;
        const shareKey = showID + "/" + String(Date.now());
        var FBShared = false;
        var IGShared = false;
        //to cancel or edit cron jobs, we store a unique ID in the database based on showID and timestamp. 
        //If this matches upon a scheduled run, we run the process. If not, we ignore it and skip the run. 
        console.log(req.body)
        var date;
        if (schedule) {
            date = new Date(schedule)
            console.log(date)
        }
        // const flyerID = uuidv4();
        // let imagePath = await uploadBaseImage(image, "temps", flyerID, Date.now(), "jpeg");
        // console.log("Image URL", imagePath)
        // console.log("Caption", caption)
        var show = await getSingleShow(showID);
        var imagePath = process.env.REACT_APP_IMAGE_URL + show.flyer
        var caption = show.description
        if (shareToIG && igid) {
            if (schedule) {
                console.log("Attempting to schedule Instagram")
                IGShared = date;
                new CronJob(
                    date,
                    async function () {
                        if(getShowSocialStatus(showID).shareKey === shareKey){
                        show = await getSingleShow(showID);
                        imagePath = process.env.REACT_APP_IMAGE_URL + show.flyer
                        caption = show.description
                        _instagramPublishContent(igid, imagePath, caption, accessToken)
                        }else{
                            console.log("Assuming change has been made to IG sharing for showID " + showID + ". Skipping.")
                        }
                    },
                    null,
                    true)
            } else {
                IGShared = await _instagramPublishContent(igid, imagePath, caption, accessToken);
            }
        }
        if (shareToFB && fbid) {
            FBShared = date;
            if (schedule) {
                new CronJob(
                    date,
                    async function () {
                        if(getShowSocialStatus(showID).shareKey === shareKey){
                        show = await getSingleShow(showID);
                        imagePath = process.env.REACT_APP_IMAGE_URL + show.flyer
                        caption = show.description
                        _facebookPublishContent(fbid, imagePath, caption, accessToken)
                        }else{
                            console.log("Assuming change has been made to FB sharing for showID " + showID + ". Skipping.")
                        }
                    },
                    null,
                    true)
            } else {
                FBShared = await _facebookPublishContent(fbid, imagePath, caption, accessToken);
            }
        }
        console.log(FBShared)
        //update sharing information for show
        const shareStatus = {
            shareKey: shareKey,
            facebook: FBShared,
            instagram: IGShared
        }
        updateShowSocialStatus(showID, shareStatus);
        if (schedule) {
            console.log("Flyer scheduled for " + schedule)
            res.send({ state: "scheduled" })
        } else {
            console.log("Flyer shared directly")
            res.send({ state: "shared" })
        }
    } catch (err) {
        next(err)
    }
};

export { _flyerShare as flyerShare };

const _facebookPublishContent = async (fbid, imagePath, caption, accessToken) => {
    try {
        console.log("Initiating share to Facebook...")
        let response = await axios.post(`https://graph.facebook.com/v18.0/${fbid}/photos`, null, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                url: imagePath,
                message: caption,
                published: true,
                access_token: accessToken
            }
        });
        if (response.data.error) {
            console.log("An error occurred while sharing to Facebook", response.data.error.code)
            return false
        }
        console.log("Image shared successfully to Facebook")
        return true
    } catch (error) {
        console.log("Failed to share to Facebook:", error.code)
        return false;
    }
}

const _instagramPublishContent = async (igid, imagePath, caption, accessToken) => {
    try {
        console.log("Sharing to Instagram...")
        let response = await axios.post(`https://graph.facebook.com/v18.0/${igid}/media`, null, {
            params: {
                image_url: imagePath,
                caption: caption,
                is_carousel_item: false,
                access_token: accessToken
            }
        });
        if (response.data.error) {
            console.log("Failed to initialize container", response.data.error.code)
        }

        const { id: containerId } = response.data;
        console.log("containerID: ", containerId);

        response = await axios.post(`https://graph.facebook.com/v18.0/${igid}/media_publish`, null, {
            params: {
                creation_id: containerId,
                access_token: accessToken
            }
        });
        console.log("Image shared successfully to Instagram")
        return true
    } catch (error) {
        console.log("Failed to share to Instagram:", error.code)
        return false;
    }
}

const _respondToPerformance = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_BOOK_SHOW"];
        const verified = permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        var result;
        if (req.body.artistID) {
            result = await respondToPerformance("industry", res.locals.uid, req.body.artistID, req.body.showID, req.body.status, verified, req.body.hasTextContactEnabled);
            if (req.body.status === "accepted") {
                if (req.body.hasTextContactEnabled) {
                    dispatchNotification(req.body.artistID, "APPLICATION_ACCEPTED_REQUIRES_CONFIRMATION", { venueID: req.body.venueID, showID: req.body.showID });

                }
                dispatchNotification(req.body.artistID, "APPLICATION_ACCEPTED", { venueID: req.body.venueID, showID: req.body.showID })
            }
        } else {
            result = await respondToShowrunner("industry", res.locals.uid, req.body.SRID, req.body.showID, req.body.status, req.body.verified)
        }
        res.send(result);
    } catch (err) {
        next(err);
    }
};
export { _respondToPerformance as respondToPerformance };

const _updateShowDescription = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_UPDATE_FLYER"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        const result = await updateShowDescription(req.body.showID, req.body.description);
        res.send(result);
    } catch (err) {
        next(err);
    }
}

export { _updateShowDescription as updateShowDescription };

const _checkCashLedger = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_MANAGE_PAYOUTS"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        const ledger = await checkCashLedger(req.body.venueID, req.body.showID);
        if (ledger) {
            res.send(ledger)
        } else {
            res.send(generateBlankCashLedger(req.body.venueID, req.body.showID));
        }
    } catch (err) {
        next(err);
    }
}

export { _checkCashLedger as checkCashLedger }


const _updateCashLedger = async (req, res, next) => {
    try {
        const REQUIRED_PERMISSIONS = ["CAN_EDIT_SHOWS"];
        permCheck(REQUIRED_PERMISSIONS, res.locals.permissions);
        await updateCashLedger(req.body.venueID, req.body.showID, req.body.type, req.body.amount);
        res.send(true)
    } catch (err) {
        next(err)
    }
}

export { _updateCashLedger as updateCashLedger }

const _handleIncomingSMS = async (req, res, next) => {
    try {
        const messageBody = req.body.Body || '';
        const response = await handleIncomingSMSResponse(messageBody, req.body.uid, req.body.showID, req.body.showDate, req.body.venuePhone, req.body.artistname, req.body.artistPhone);
        res.send(response);
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export { _handleIncomingSMS as handleIncomingSMS };