import express from 'express';
import auth from '../middleware/auth.middleware';
import roleMiddleware from '../middleware/role.middleware';
import { getNearbyTechnicians, getTechnicianById } from '../controllers/technician.controller';

const router = express.Router();

router.get('/nearby', auth, roleMiddleware('user'), getNearbyTechnicians);
router.get('/:id', auth, getTechnicianById);

export default router;
