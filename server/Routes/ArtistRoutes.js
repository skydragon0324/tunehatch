import { Router } from 'express';
import { stripeRequest } from '../Controllers/IndustryController.js';
import { userAuth } from '../Middleware/UserMiddleware.js';
import { apply, calculatePayouts, getStripeStatus, respondToPerformance } from '../Controllers/ArtistController.js';
const router = Router();

router.use(userAuth)
router.get('/', (req, res) => {
  res.send('Artist API');
});
router.post('/stripe-request', stripeRequest);

router.post('/calculate-payouts', calculatePayouts);

router.post('/apply', apply)

router.post('/respond-to-performance', respondToPerformance);

router.post('/get-stripe-status', getStripeStatus);

// Export the router
export default router;