import { Router } from 'express';
import { userAuth } from '../Middleware/UserMiddleware.js';
import { getNotifications, notifsAllRead, clearNotifs, editProfile, handleInstagramLink, getUserTickets } from '../Controllers/UserController.js';
import { mUpload } from '../Config/mUpload.config.js';
import { createSRGroup } from '../Controllers/SRController.js';
const router = Router();


// 
router.post('/edit-profile', mUpload.fields([
  {
    name: 'avatar',
    maxCount: 1
  },
  {
    name: 'type.artist.banner',
    maxCount: 1
  }
]), userAuth, editProfile)

router.post('/create-sr-group', mUpload.fields([
  {
    name: 'avatar',
    maxCount: 1
  },
  {
    name: 'banner',
    maxCount: 1
  }
]), userAuth, createSRGroup);

router.use(userAuth)

router.get('/', (req, res) => {
  res.send('Test: User Access');
});

router.post('/get-user-tickets', getUserTickets)

router.post('/get-notifications', getNotifications);

router.post('/notifs-all-read', notifsAllRead);

router.post('/clear-notifs', clearNotifs)

router.post('/handle-instagram-link', handleInstagramLink);

// Export the router
export default router;