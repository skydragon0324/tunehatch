
import { getAllArtists, getAllShows, getCategoryInfo, verifyUser, getUsers, getVenues, sendPasswordReset, resetPassword, getUpcomingVenueShows, registerUser, selfVerifyTicket, getSpotlightInfo, fetchClaimProfile, claimProfile, waygts, getSRGroups, refreshArtistData, getActiveRegions } from '../Services/DBServices/dbService.js';
import { generateTickets } from '../Services/DBServices/dbTicketService.js';
import { generateTerminalToken, setPaymentIntent } from '../Services/apiService.js';

const _getAllArtists = async (req, res, next) => {
    try {
        const artists = await getAllArtists();
        res.send(artists);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
export { _getAllArtists as getAllArtists };

const _getSpotlightInfo = async (req, res, next) => {
    try {
        const spotlightInfo = await getSpotlightInfo();
        res.send(spotlightInfo)
    } catch (err) {
        console.log(err);
        next(err);
    }
}
export {_getSpotlightInfo as getSpotlightInfo}

const _getAllShows = async (req, res, next) => {
    try {
        const shows = await getAllShows();
        res.send(shows);
    } catch (err) {
        next(err);
    }
};
export { _getAllShows as getAllShows };

const _refreshArtistData = async(req, res, next) => {
    try{
        refreshArtistData(req.body.artistID);
    }catch(err){
        next(err);
    }
}

export {_refreshArtistData as refreshArtistData}

export async function getAllVenues(req, res, next) {
    try {
        const venues = await getVenues();
        res.send(venues);
    } catch (err) {
        next(err);
    }
}

const _getSRGroups = async (req, res, next) => {
    try {
        const groups = await getSRGroups()
        res.send(groups);
    } catch (err) {
        next(err);
    }
}

export { _getSRGroups as getSRGroups };

const _getUsers = async (req, res, next) => {
    try {
        const users = await getUsers(req.body.ids);
        res.send(users);
    } catch (err) {
        next(err);
    }
};
export { _getUsers as getUsers };

const _getCategoryInfo = async (req, res, next) => {
    try {
        const categoryInfo = await getCategoryInfo();
        res.send(categoryInfo);
    } catch (err) {
        next(err);
    }
};
export { _getCategoryInfo as getCategoryInfo };

const _verifyUser = async (req, res, next) => {
    try {
        const user = await verifyUser(req.body.SECRET_UID);
        res.send(user);
    } catch (err) {
        next(err);
    }
};
export { _verifyUser as verifyUser };

const _generateTickets = async (req, res, next) => {
    try {
        const tickets = await generateTickets(req.body.showID, req.body.venueID, res.locals.uid, req.body.intentID, req.body.email, req.body.name, req.body.cart, req.body.method);
        res.send(tickets);
    } catch (err) {
        next(err);
    }
};
export { _generateTickets as generateTickets };

const _setPaymentIntent = async (req, res, next) => {
    try {
        const stripeData = await setPaymentIntent(req.body.showID, req.body.cart, req.body.email, req.body.useDoorPrice, req.body.intentID);
        res.send(stripeData);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
export { _setPaymentIntent as setPaymentIntent };

const _sendPasswordReset = async (req, res, next) => {
    try {
        const status = await sendPasswordReset(req.body.email);
        res.send(status);
    } catch (err) {
        next(err);
    }
};
export { _sendPasswordReset as sendPasswordReset };

const _resetPassword = async (req, res, next) => {
    try {
        const user = await resetPassword(req.body.token, req.body.password);
        res.send(user);
    } catch (err) {
        next(err);
    }
};
export { _resetPassword as resetPassword };

const _getUpcomingVenueShows = async (req, res, next) => {
    try {
        const shows = await getUpcomingVenueShows(req.body.venueID);
        res.send(shows);
    } catch (err) {
        next(err);
    }
};
export { _getUpcomingVenueShows as getUpcomingVenueShows };

const _register = async (req, res, next) => {
    try {
        const user = await registerUser(req.body);
        res.send(user);
    } catch (err) {
        next(err);
    }
}
export { _register as register }

const _selfVerifyTicket = async (req, res, next) => {
    try {
        const ticketData = await selfVerifyTicket(req.body.ticketID, res.locals.uid, req.body.showID);
        res.send(ticketData);
    } catch (err) {
        next(err);
    }
}

export { _selfVerifyTicket as selfVerifyTicket }

const _fetchClaimProfile = async (req, res, next) => {
    try {
        const profile = await fetchClaimProfile(req.body.claimCode);
        res.send(profile);
    } catch (err) {
        next(err);
    }
}

export { _fetchClaimProfile as fetchClaimProfile }

const _claimProfile = async (req, res, next) => {
    try {
        const profile = await claimProfile(req.body);
        res.send(profile);
    } catch (err) {
        next(err);
    }
}

export { _claimProfile as claimProfile };

const _waygts = async (req, res, next) => {
    try {
        const result = await waygts(req.body.ticketIDs, req.body.showID, req.body.artistIDs, res.locals.uid)
        res.send(result);
    } catch (err) {
        next(err);
    }
}

export { _waygts as waygts };


const _getActiveRegions = async(req, res, next) => {
    try{
        const result = await getActiveRegions();
        res.send(result)
    }catch(err){
        next(err)
    }
}
export {_getActiveRegions as getActiveRegions}

const _generateTerminalToken = async(req, res, next) => {
    try{
        const result = await generateTerminalToken();
        res.send(result)
    }catch(err){
        next(err);
    }
}

export {_generateTerminalToken as generateTerminalToken}