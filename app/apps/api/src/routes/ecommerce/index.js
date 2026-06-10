import express from 'express';
import checkoutRouter from './checkout.js';
import ordersRouter from './orders.js';

const router = express.Router();

router.use('/checkout', checkoutRouter);
router.use('/orders', ordersRouter);

export default router;
