import { Router } from 'express';
import { getAllArtists, getAllShows, getCategoryInfo, verifyUser, getUsers, getAllVenues, generateTickets, setPaymentIntent, sendPasswordReset, resetPassword, getUpcomingVenueShows, register, selfVerifyTicket, getSpotlightInfo, fetchClaimProfile, claimProfile, waygts, getSRGroups, refreshArtistData, getActiveRegions, generateTerminalToken } from '../Controllers/PublicController.js';
import { handleSpotifyAccessToken, logIn } from '../Controllers/UserController.js';
import { optionalUserAuth } from '../Middleware/UserMiddleware.js';
import { repairDamagedTickets } from '../Services/DBServices/dbTicketService.js';

const router = Router();

router.get('/', (req, res) => {
  res.send('Testing: Public');
});

router.post('/log-in', logIn)

router.post('/register', register);

router.post('/verify-user', verifyUser)

router.post('/send-password-reset', sendPasswordReset);

router.post('/reset-password', resetPassword);

router.get('/get-category-info', getCategoryInfo);

router.get('/get-spotlight-info', getSpotlightInfo);

router.get('/get-all-artists', getAllArtists)

router.get('/get-all-shows', getAllShows)

router.post('/get-upcoming-venue-shows', getUpcomingVenueShows);

router.post('/get-users', getUsers)

router.get('/get-all-venues', getAllVenues);

router.get('/get-sr-groups', getSRGroups);

router.post('/self-verify-ticket', optionalUserAuth, selfVerifyTicket)

router.post('/generate-tickets', optionalUserAuth, generateTickets);

router.post('/waygts', optionalUserAuth, waygts);

router.post('/set-payment-intent', optionalUserAuth, setPaymentIntent)

router.post('/fetch-claim-profile', fetchClaimProfile);

router.post('/claim-profile', claimProfile);

router.post('/spotify-token', handleSpotifyAccessToken);

router.post('/refresh-artist-data', refreshArtistData);

router.get('/get-active-regions', getActiveRegions);

router.get('/generate-terminal-token', generateTerminalToken);

// router.get('/repair-damaged-tickets', repairDamagedTickets);

// Export the router
export default router;
