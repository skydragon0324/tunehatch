import { Router } from 'express';
import { userAuth } from '../Middleware/UserMiddleware.js';
import { verifyPermissions } from '../Middleware/PermissionHandler.js';
import { createNewVenue, stripeRequest } from '../Controllers/IndustryController.js';
import { mUpload } from '../Config/mUpload.config.js';
import { getSoldTickets, createShow, rescheduleShow, editVenueProfile, getVenueAdminData, getVenuePermissions, redeemTicket, getShowNotes, saveDeal, deleteShow, editShow, updatePerformanceAgreement, editShowNotes, calculatePayouts, sendPayment, sendStripeReminderEmail, updateLedgerAmount, getShowPayoutStatus } from '../Controllers/VenueController.js';
const router = Router();


//multer uploads

router.post('/create-new-venue', mUpload.fields([
   {
      name: 'avatar',
      maxCount: 1
   },
   {
      name: 'images',
      maxCount: 3
   },
   {
      name: 'banner',
      maxCount: 1
   }
]), userAuth, createNewVenue);


router.post('/edit-venue', mUpload.fields([
   {
      name: 'avatar',
      maxCount: 1
   },
   {
      name: 'images',
      maxCount: 3
   },
   {
      name: 'banner',
      maxCount: 1
   }
]), userAuth, verifyPermissions, editVenueProfile)


router.post('/edit-show-notes', mUpload.fields([
   {
      name: 'attachments',
      maxCount: 3
   }
]), userAuth, verifyPermissions, editShowNotes);

router.use(userAuth)
router.use(verifyPermissions)

router.get('/', verifyPermissions, (req, res) => {
   res.send('Testing: Industry Access');
});


router.post('/stripe-request', stripeRequest)

router.post('/get-sold-tickets', getSoldTickets)

router.post('/create-show', createShow);

router.post('/calculate-payouts', calculatePayouts)

router.post('/get-show-payout-status', getShowPayoutStatus);

router.post('/send-payment', sendPayment)

router.post('/update-ledger-amount', updateLedgerAmount);

router.post('/send-stripe-reminder-email', sendStripeReminderEmail)

router.post('/edit-show', editShow);

router.post('/reschedule-show', rescheduleShow);

router.post('/get-admin-data', getVenueAdminData);

router.post('/delete-show', deleteShow)

router.post('/get-venue-permissions', getVenuePermissions);

router.post('/redeem-ticket', redeemTicket);

router.post('/save-deal', saveDeal);

router.post('/get-show-notes', getShowNotes);

router.post('/update-performance-agreement', updatePerformanceAgreement);
// Export the router
export default router;