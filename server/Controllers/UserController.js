import { logIn, getNotifications, clearNotifs, notifsAllRead, editProfile, getUserTickets } from "../Services/DBServices/dbService.js";
import { getInstagramToken, getSpotifyToken } from "../Services/apiService.js";
import { generateVenueList } from "../Services/cleaningService.js";


const _getNotifications = async (req, res, next) => {
    try {
        const venueList = await generateVenueList(res.locals.uid, "CAN_MESSAGE");
        const notifications = await getNotifications(res.locals.uid, venueList);
        res.send(notifications);
    } catch (err) {
        next(err);
    }
};
export { _getNotifications as getNotifications };

const _clearNotifs = async (req, res, next) => {
    try {
        const venueList = await generateVenueList(res.locals.uid, "CAN_MESSAGE");
        const notifications = await clearNotifs(res.locals.uid, venueList);
        res.send(notifications);
    } catch (err) {
        next(err);
    }
};
export { _clearNotifs as clearNotifs };

const _notifsAllRead = async (req, res, next) => {
    try {
        const venueList = await generateVenueList(res.locals.uid, "CAN_MESSAGE");
        const notifications = await notifsAllRead(res.locals.uid, venueList);
        console.log(notifications)
        res.send(notifications);
    } catch (err) {
        next(err);
    }
};
export { _notifsAllRead as notifsAllRead };

const _getUserTickets = async(req, res, next) => {
    try{
        const tickets = await getUserTickets(res.locals.uid);
        res.send(tickets)
    }catch(err){
        next(err)
    }
}

export {_getUserTickets as getUserTickets}

const _logIn = async (req, res, next) => {
    try {
        const user = await logIn(req.body.username, req.body.password);
        res.send(user);
    } catch (err) {
        next(err);
    }
};
export { _logIn as logIn };

const _editProfile = async (req, res, next) => {
    try {
        const profile = await editProfile(res.locals.uid, req.body, req.files);
        res.send(profile);
    } catch (err) {
        throw err;
    }
};
export { _editProfile as editProfile };

const _handleInstagramLink = async (req, res, next) => {
    try {
        const result = await getInstagramToken(req.body.code);
        res.send(result);
    } catch (err) {
        throw err;
    }
}
export { _handleInstagramLink as handleInstagramLink };

const _handleSpotifyAccessToken= async (req, res, next) => {
    try {
        const spotifyAccessToken = await getSpotifyToken();
        res.send(spotifyAccessToken);
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export { _handleSpotifyAccessToken as handleSpotifyAccessToken };
