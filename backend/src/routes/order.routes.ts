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

router.post('/', auth, roleMiddleware('user'), validate(createOrderSchema), createOrder);
router.get('/available', auth, roleMiddleware('technician'), getAvailableOrders);
router.patch('/:id/accept', auth, roleMiddleware('technician'), acceptOrder);
router.get('/my-jobs', auth, roleMiddleware('technician'), getMyJobs);
router.patch('/:id/status', auth, roleMiddleware('technician'), updateOrderStatus);
router.get('/', auth, getOrders);

router.get('/my', auth, getMyOrders);

export default router;
