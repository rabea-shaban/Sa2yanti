import express from 'express';

import auth from '../middleware/auth.middleware';

import validate from '../middleware/validate.middleware';

import {
  acceptOrder,
  createOrder,
  getAvailableOrders,
  getMyJobs,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} from '../controllers/order.controller';
import roleMiddleware from '../middleware/role.middleware';
import { createOrderSchema } from '../validators/order.validator';

const router = express.Router();

router.post('/', auth, roleMiddleware('user', 'admin'), validate(createOrderSchema), createOrder);
router.get('/available', auth, roleMiddleware('technician', 'admin'), getAvailableOrders);
router.post('/:id/accept', auth, roleMiddleware('technician', 'admin'), acceptOrder);
router.get('/my-jobs', auth, roleMiddleware('technician', 'admin'), getMyJobs);
router.patch('/:id/status', auth, roleMiddleware('technician', 'admin'), updateOrderStatus);
router.get('/', auth, getOrders);
router.get('/my', auth, getMyOrders);

export default router;
