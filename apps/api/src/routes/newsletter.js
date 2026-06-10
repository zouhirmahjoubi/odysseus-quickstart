import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to verify admin status
function verifyAdmin(req) {
  const userId = req.user?.id;
  const isAdmin = req.user?.isAdmin === true;

  if (!userId || !isAdmin) {
    throw new Error('Admin access required');
  }

  return userId;
}

// POST /newsletter/subscribe - Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email format is invalid' });
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Check if already subscribed
  try {
    const existingSubscriber = await pb.collection('newsletter_subscribers').getFirstListItem(`email = "${trimmedEmail}"`);
    if (existingSubscriber) {
      return res.status(400).json({ error: 'Email is already subscribed to the newsletter' });
    }
  } catch (error) {
    // Email not found, which is expected - continue with subscription
  }

  // Create subscriber record
  const subscriber = await pb.collection('newsletter_subscribers').create({
    email: trimmedEmail,
    status: 'subscribed',
    subscribedAt: new Date().toISOString(),
  });

  logger.info(`Newsletter subscriber added: id=${subscriber.id}, email=${trimmedEmail}`);

  res.json({
    success: true,
    subscriberId: subscriber.id,
    message: 'Successfully subscribed to the newsletter',
  });
});

// GET /newsletter/subscribers - Get all subscribers (admin only)
router.get('/subscribers', async (req, res) => {
  verifyAdmin(req);

  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 20;

  const subscribers = await pb.collection('newsletter_subscribers').getList(page, perPage, {
    sort: '-created',
  });

  logger.info(`Retrieved ${subscribers.items.length} newsletter subscribers (page ${page})`);

  res.json({
    items: subscribers.items,
    page: subscribers.page,
    perPage: subscribers.perPage,
    totalItems: subscribers.totalItems,
    totalPages: subscribers.totalPages,
  });
});

// DELETE /newsletter/subscribers/:id - Delete subscriber (admin only)
router.delete('/subscribers/:id', async (req, res) => {
  verifyAdmin(req);

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Subscriber ID is required' });
  }

  const subscriber = await pb.collection('newsletter_subscribers').getOne(id);

  if (!subscriber) {
    throw new Error(`Subscriber ${id} not found`);
  }

  await pb.collection('newsletter_subscribers').delete(id);

  logger.info(`Newsletter subscriber deleted: id=${id}, email=${subscriber.email}`);

  res.json({
    success: true,
    message: 'Subscriber deleted successfully',
    subscriberId: id,
  });
});

export default router;
