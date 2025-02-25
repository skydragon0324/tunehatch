import { Router } from 'express';
import { userAuth } from '../Middleware/UserMiddleware.js';
import { editSRGroup } from '../Controllers/SRController.js';
import { mUpload } from '../Config/mUpload.config.js';
const router = Router();

router.post('/edit-sr-group', mUpload.fields([
  {
    name: 'avatar',
    maxCount: 1
  },
  {
    name: 'banner',
    maxCount: 1
  }
]), userAuth, editSRGroup)

router.use(userAuth)
router.get('/', (req, res) => {
  res.send('Showrunner API');
});

// Export the router
export default router;