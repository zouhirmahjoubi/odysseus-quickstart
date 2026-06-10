import express from 'express';
import Stripe from 'stripe';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { sendEmail } from '../utils/email.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware to check admin status (basic implementation)
const requireAdmin = (req, res, next) => {
  const isAdmin = req.headers['x-admin-token'] === process.env.ADMIN_TOKEN;
  if (!isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// GET /orders - List all orders (admin only)
router.get('/', requireAdmin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 20;

  const orders = await pb.collection('orders').getList(page, perPage, {
    sort: '-created',
  });

  logger.info(`Retrieved ${orders.items.length} orders (page ${page})`);

  res.json({
    items: orders.items,
    page: orders.page,
    perPage: orders.perPage,
    totalItems: orders.totalItems,
    totalPages: orders.totalPages,
  });
});

// GET /orders/:id - Get single order
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const order = await pb.collection('orders').getOne(id);

  if (!order) {
    throw new Error(`Order ${id} not found`);
  }

  logger.info(`Retrieved order ${id}`);

  res.json(order);
});

// PUT /orders/:id - Update order status/notes (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, notes, trackingNumber } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  // Validate status if provided
  if (status) {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'failed', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }
  }

  // Build update data
  const updateData = {};
  if (status) updateData.status = status;
  if (notes) updateData.notes = notes;
  if (trackingNumber) updateData.trackingNumber = trackingNumber;

  const updatedOrder = await pb.collection('orders').update(id, updateData);

  logger.info(`Updated order ${id}: ${JSON.stringify(updateData)}`);

  res.json(updatedOrder);
});

// POST /orders/:id/refund - Process refund (admin only)
router.post('/:id/refund', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const order = await pb.collection('orders').getOne(id);

  if (!order) {
    throw new Error(`Order ${id} not found`);
  }

  if (!order.stripePaymentIntentId) {
    throw new Error(`Order ${id} has no associated Stripe PaymentIntent`);
  }

  // Create refund via Stripe
  const refund = await stripe.refunds.create({
    payment_intent: order.stripePaymentIntentId,
    reason: reason || 'requested_by_customer',
  });

  // Update order status
  const updatedOrder = await pb.collection('orders').update(id, {
    status: 'refunded',
    refundId: refund.id,
    refundReason: reason || 'requested_by_customer',
    refundedAt: new Date().toISOString(),
  });

  logger.info(`Refund processed for order ${id}: refundId=${refund.id}`);

  // Send refund notification email
  try {
    await sendEmail({
      type: 'payment_receipt',
      orderId: id,
      customerEmail: order.customerEmail || 'customer@example.com',
      orderData: {
        orderId: id,
        status: 'refunded',
        refundId: refund.id,
        refundReason: reason || 'requested_by_customer',
      },
    });
  } catch (emailError) {
    logger.error(`Failed to send refund notification email: ${emailError.message}`);
  }

  res.json({
    orderId: id,
    refundId: refund.id,
    refundStatus: refund.status,
    amount: refund.amount / 100,
  });
});

export default router;