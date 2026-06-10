import express from 'express';
import { sendEmail } from '../utils/email.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /send-email - Send email notification
router.post('/', async (req, res) => {
  const { type, orderId, customerEmail, orderData } = req.body;

  // Validate required fields
  if (!type || !orderId || !customerEmail || !orderData) {
    return res.status(400).json({ error: 'Missing required fields: type, orderId, customerEmail, orderData' });
  }

  // Validate email type
  const validTypes = ['order_confirmation', 'payment_receipt', 'shipping_notification', 'delivery_confirmation'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: `Invalid email type. Must be one of: ${validTypes.join(', ')}` });
  }

  // Send email
  const result = await sendEmail({
    type,
    orderId,
    customerEmail,
    orderData,
  });

  logger.info(`Email sent: type=${type}, orderId=${orderId}, to=${customerEmail}`);

  res.json({
    success: true,
    messageId: result.messageId,
  });
});

export default router;