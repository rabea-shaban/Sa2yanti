import express from 'express';

import auth from '../middleware/auth.middleware';

import validate from '../middleware/validate.middleware';

import { createOrder, getMyOrders, getOrders } from '../controllers/order.controller';
import roleMiddleware from '../middleware/role.middleware';
import { createOrderSchema } from '../validators/order.validator';

const router = express.Router();

router.post('/', auth, roleMiddleware('user'), validate(createOrderSchema), createOrder);

router.get('/', auth, getOrders);

router.get('/my', auth, getMyOrders);

export default router;
