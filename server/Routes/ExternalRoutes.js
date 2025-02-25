import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.send('Testing: External Access');
});


// Export the router
export default router;