import { Router } from 'express';
import { userAuth } from '../Middleware/UserMiddleware.js';
import { verifyPermissions, verifyShowPermissions } from '../Middleware/PermissionHandler.js';
import { loadDeal, getConversations, sendMessage, markReadMessage, cancelBooking, createNewVenue, inviteArtists, toggleLineupLock, addConfirmedArtists, respondToPerformance, publishShow, updateShowFlyer, updateShowDescription, checkCashLedger, updateCashLedger, stripeRequest, handleIncomingSMS, flyerShare } from '../Controllers/IndustryController.js';
import { mUpload } from '../Config/mUpload.config.js';
const router = Router();

router.use(userAuth)

router.get('/', verifyPermissions, (req, res) => {
  res.send('Testing: Industry Access');
});

router.post('/stripe-request', verifyPermissions, stripeRequest)

router.post('/update-show-flyer', userAuth, verifyShowPermissions, updateShowFlyer);

router.post('/update-show-description', verifyShowPermissions, updateShowDescription)

router.post('/invite-artists', verifyShowPermissions, inviteArtists)

router.post('/toggle-lineup-lock', verifyShowPermissions, toggleLineupLock)

router.post('/publish-show', verifyShowPermissions, publishShow);

router.post('/add-confirmed-artists', verifyShowPermissions, addConfirmedArtists)

router.post('/respond-to-performance', verifyShowPermissions, respondToPerformance)

router.post('/cancel-booking', verifyShowPermissions, cancelBooking);

router.post('/load-deal', verifyPermissions, loadDeal)

router.post('/get-messages', getConversations)

router.post('/send-message', sendMessage);

router.post('/mark-read-message', markReadMessage);

router.post('/check-cash-ledger', verifyPermissions, checkCashLedger)

router.post('/update-cash-ledger', verifyPermissions, updateCashLedger)

router.post('/flyer-share', flyerShare)

router.post('/incoming-sms', handleIncomingSMS);

// Export the router
export default router;