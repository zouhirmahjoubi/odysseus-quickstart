import express from 'express';
import pb from '../../utils/pocketbaseClient.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// POST /orders - Save completed order
router.post('/', async (req, res) => {
  const { orderId, customerId, items, shippingAddress, total, stripePaymentIntentId, status } = req.body;

  // Validate required fields
  if (!orderId || !items || !shippingAddress || total === undefined || !stripePaymentIntentId) {
    return res.status(400).json({ error: 'Missing required fields: orderId, items, shippingAddress, total, stripePaymentIntentId' });
  }

  if (status && status !== 'completed' && status !== 'pending') {
    return res.status(400).json({ error: 'Status must be "completed" or "pending"' });
  }

  // Update existing order or create new one
  const orderData = {
    orderId,
    customerId: customerId || 'guest',
    items: typeof items === 'string' ? items : JSON.stringify(items),
    shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
    total,
    stripePaymentIntentId,
    status: status || 'completed',
    completedAt: new Date().toISOString(),
  };

  // Try to update existing order, or create new one
  let orderRecord;
  try {
    const existingOrder = await pb.collection('orders').getFirstListItem(`orderId = "${orderId}"`);
    orderRecord = await pb.collection('orders').update(existingOrder.id, orderData);
  } catch (error) {
    // Order doesn't exist, create new one
    orderRecord = await pb.collection('orders').create(orderData);
  }

  // Calculate estimated delivery (5-7 business days)
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  logger.info(`Order ${orderId} completed and saved to database`);

  res.json({
    orderId,
    orderDate: new Date().toISOString(),
    estimatedDelivery: estimatedDelivery.toISOString(),
  });
});

// GET /orders/:orderId - Retrieve order details
router.get('/:orderId', async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const orderRecord = await pb.collection('orders').getFirstListItem(`orderId = "${orderId}"`);

  if (!orderRecord) {
    throw new Error(`Order ${orderId} not found`);
  }

  // Parse stored JSON fields
  const items = typeof orderRecord.items === 'string' ? JSON.parse(orderRecord.items) : orderRecord.items;
  const shippingAddress = typeof orderRecord.shippingAddress === 'string' ? JSON.parse(orderRecord.shippingAddress) : orderRecord.shippingAddress;

  // Calculate estimated delivery
  const orderDate = new Date(orderRecord.created);
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  logger.info(`Retrieved order details for ${orderId}`);

  res.json({
    orderId: orderRecord.orderId,
    orderDate: orderRecord.created,
    items,
    subtotal: orderRecord.subtotal,
    tax: orderRecord.tax,
    shipping: orderRecord.shipping,
    total: orderRecord.total,
    shippingAddress,
    estimatedDelivery: estimatedDelivery.toISOString(),
    status: orderRecord.status,
  });
});

export default router;
