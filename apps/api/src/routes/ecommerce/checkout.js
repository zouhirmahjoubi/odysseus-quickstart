import express from 'express';
import { initializeStripe } from '../../utils/stripe.js';
import pb from '../../utils/pocketbaseClient.js';
import logger from '../../utils/logger.js';

const router = express.Router();
const stripe = initializeStripe();

// POST /checkout - Create PaymentIntent and pending order
router.post('/checkout', async (req, res) => {
  const { items, shippingAddress, billingAddress, paymentMethod, customerId } = req.body;

  // Validate required fields
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items array is required and must not be empty' });
  }

  if (!shippingAddress || !shippingAddress.name || !shippingAddress.email || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip) {
    return res.status(400).json({ error: 'Complete shipping address is required' });
  }

  if (!paymentMethod) {
    return res.status(400).json({ error: 'Payment method is required' });
  }

  // Validate cart items
  for (const item of items) {
    if (!item.productId || !item.quantity || item.price === undefined) {
      throw new Error('Each item must have productId, quantity, and price');
    }
    if (item.quantity <= 0 || item.price < 0) {
      throw new Error('Item quantity must be positive and price must be non-negative');
    }
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.1 * 100) / 100; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping if subtotal > $100
  const total = subtotal + tax + shipping;
  const totalInCents = Math.round(total * 100);

  // Generate order ID
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalInCents,
    currency: 'usd',
    payment_method_types: ['card'],
    metadata: {
      orderId,
      customerId: customerId || 'guest',
    },
  });

  // Store pending order in database
  const orderRecord = await pb.collection('orders').create({
    orderId,
    customerId: customerId || 'guest',
    items: JSON.stringify(items),
    shippingAddress: JSON.stringify(shippingAddress),
    billingAddress: billingAddress ? JSON.stringify(billingAddress) : JSON.stringify(shippingAddress),
    subtotal,
    tax,
    shipping,
    total,
    stripePaymentIntentId: paymentIntent.id,
    status: 'pending',
  });

  logger.info(`Created pending order ${orderId} with PaymentIntent ${paymentIntent.id}`);

  res.json({
    clientSecret: paymentIntent.client_secret,
    orderId,
    total,
    paymentIntentId: paymentIntent.id,
  });
});

export default router;
