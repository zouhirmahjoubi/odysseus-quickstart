import express from 'express';
import Stripe from 'stripe';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { sendEmail } from '../utils/email.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /webhook/stripe - Handle Stripe webhook events
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables');
  }

  let event;

  // Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error) {
    logger.error(`Webhook signature verification failed: ${error.message}`);
    throw new Error(`Webhook signature verification failed: ${error.message}`);
  }

  logger.info(`Received Stripe webhook event: ${event.type}`);

  // Handle payment_intent.succeeded
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { customerId, shippingAddress, billingAddress, isDigital, productName } = paymentIntent.metadata;

    const isDigitalPurchase = isDigital === 'true' || 
                             (productName && (productName.toLowerCase().includes('launch kit') || 
                                              productName.toLowerCase().includes('toolkit') || 
                                              productName.toLowerCase().includes('hardened stack')));

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const downloadUrl = isDigitalPurchase 
      ? `${frontendUrl}/success?session_id=${paymentIntent.id}`
      : null;

    // Create order record
    const orderRecord = await pb.collection('orders').create({
      stripePaymentIntentId: paymentIntent.id,
      customerId: customerId || 'guest',
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      status: 'completed',
      completedAt: new Date().toISOString(),
    });

    logger.info(`Order created for PaymentIntent ${paymentIntent.id}`);

    // Send order confirmation email
    try {
      await sendEmail({
        type: 'order_confirmation',
        orderId: orderRecord.id,
        customerEmail: paymentIntent.receipt_email || paymentIntent.billing_details?.email || 'customer@example.com',
        orderData: {
          orderId: orderRecord.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          shippingAddress: shippingAddress ? JSON.parse(shippingAddress) : null,
          isDigital: isDigitalPurchase,
          downloadUrl: downloadUrl,
        },
      });
    } catch (emailError) {
      logger.error(`Failed to send order confirmation email: ${emailError.message}`);
    }
  }

  // Handle payment_intent.payment_failed
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    const { customerId } = paymentIntent.metadata;

    // Try to find and update existing order
    try {
      const existingOrder = await pb.collection('orders').getFirstListItem(`stripePaymentIntentId = "${paymentIntent.id}"`);
      await pb.collection('orders').update(existingOrder.id, {
        status: 'failed',
        failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
      });

      logger.info(`Order status updated to failed for PaymentIntent ${paymentIntent.id}`);

      // Send failure notification email
      try {
        await sendEmail({
          type: 'payment_receipt',
          orderId: existingOrder.id,
          customerEmail: paymentIntent.receipt_email || 'customer@example.com',
          orderData: {
            orderId: existingOrder.id,
            status: 'failed',
            failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
          },
        });
      } catch (emailError) {
        logger.error(`Failed to send payment failure email: ${emailError.message}`);
      }
    } catch (error) {
      logger.warn(`No existing order found for PaymentIntent ${paymentIntent.id}`);
    }
  }

  res.json({ received: true });
});

export default router;