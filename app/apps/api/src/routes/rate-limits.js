import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Middleware to verify authentication
const requireAuth = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = userId;
  next();
};

/**
 * GET /rate-limits - Get user's current rate limits and usage
 */
router.get('/', requireAuth, async (req, res) => {
  const { userId } = req;

  try {
    // Get or create rate limit record
    let rateLimitRecord;
    try {
      rateLimitRecord = await pb.collection('rate_limits').getFirstListItem(`user_id = "${userId}"`);
    } catch (error) {
      // Create default rate limit record
      rateLimitRecord = await pb.collection('rate_limits').create({
        user_id: userId,
        requests_per_minute: 60,
        requests_per_hour: 1000,
        requests_per_day: 10000,
        test_runs_per_day: 100,
        agent_installations_per_month: 50,
        current_minute_count: 0,
        current_hour_count: 0,
        current_day_count: 0,
        minute_reset_at: new Date(Date.now() + 60000).toISOString(),
        hour_reset_at: new Date(Date.now() + 3600000).toISOString(),
        day_reset_at: new Date(Date.now() + 86400000).toISOString(),
      });
    }

    logger.info(`Retrieved rate limits for user ${userId}`);

    res.json({
      requests_per_minute: rateLimitRecord.requests_per_minute,
      requests_per_hour: rateLimitRecord.requests_per_hour,
      requests_per_day: rateLimitRecord.requests_per_day,
      test_runs_per_day: rateLimitRecord.test_runs_per_day || 100,
      agent_installations_per_month: rateLimitRecord.agent_installations_per_month || 50,
      current_usage: {
        minute: rateLimitRecord.current_minute_count || 0,
        hour: rateLimitRecord.current_hour_count || 0,
        day: rateLimitRecord.current_day_count || 0,
      },
      reset_times: {
        minute_reset_at: rateLimitRecord.minute_reset_at,
        hour_reset_at: rateLimitRecord.hour_reset_at,
        day_reset_at: rateLimitRecord.day_reset_at,
      },
    });
  } catch (error) {
    logger.error(`Get rate limits error: ${error.message}`);
    throw error;
  }
});

export default router;
