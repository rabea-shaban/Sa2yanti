import express from 'express';

import auth from '../middleware/auth.middleware';

import validate from '../middleware/validate.middleware';

import { createOrderSchema } from '../validators/order.validator';

import { createOrder, getOrders, getMyOrders } from '../controllers/order.controller';

const router = express.Router();

router.post('/', auth, validate(createOrderSchema), createOrder);

router.get('/', auth, getOrders);

router.get('/my', auth, getMyOrders);

export default router;
