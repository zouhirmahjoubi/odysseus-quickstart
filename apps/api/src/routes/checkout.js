import express from 'express';
import Stripe from 'stripe';
import logger from '../utils/logger.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /checkout - Create Stripe Checkout Session
router.post('/', async (req, res) => {
  const { items, customerId, shippingAddress, billingAddress, couponCode } = req.body;

  // Validate required fields
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items array is required and must not be empty' });
  }

  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
    return res.status(400).json({ error: 'Complete shipping address is required' });
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

  // Build line items for Stripe
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.productId,
      },
      unit_amount: Math.round(item.price * 100), // Convert to cents
    },
    quantity: item.quantity,
  }));

  // Create Stripe Checkout Session
  const sessionParams = {
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cancel`,
    metadata: {
      customerId: customerId || 'guest',
      shippingAddress: JSON.stringify(shippingAddress),
      billingAddress: billingAddress ? JSON.stringify(billingAddress) : JSON.stringify(shippingAddress),
    },
  };

  // Add coupon if provided
  if (couponCode) {
    sessionParams.discounts = [{ coupon: couponCode }];
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionParams);

    logger.info(`Created Checkout Session ${session.id} for customer ${customerId || 'guest'}`);

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    logger.error(`Stripe Session Creation Error: ${error.message}`);
    res.status(500).json({
      error: 'Failed to initiate Stripe checkout',
      details: error.message
    });
  }
});

export default router;