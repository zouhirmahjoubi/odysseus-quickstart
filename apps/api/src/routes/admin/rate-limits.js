import 'dotenv/config';
import express from 'express';
import pb from '../../utils/pocketbaseClient.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// Middleware to verify admin authentication
const requireAdmin = (req, res, next) => {
  const adminToken = req.headers['x-admin-token'];
  if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

/**
 * GET /admin/rate-limits - List all users' rate limits
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const rateLimits = await pb.collection('rate_limits').getList(page, perPage, {
      sort: '-created',
    });

    // Enrich with user info
    const items = await Promise.all(
      rateLimits.items.map(async (rateLimit) => {
        try {
          const user = await pb.collection('users').getOne(rateLimit.user_id);
          return {
            user_id: rateLimit.user_id,
            email: user.email,
            requests_per_minute: rateLimit.requests_per_minute,
            requests_per_hour: rateLimit.requests_per_hour,
            requests_per_day: rateLimit.requests_per_day,
            test_runs_per_day: rateLimit.test_runs_per_day || 100,
            agent_installations_per_month: rateLimit.agent_installations_per_month || 50,
            current_usage: {
              minute: rateLimit.current_minute_count || 0,
              hour: rateLimit.current_hour_count || 0,
              day: rateLimit.current_day_count || 0,
            },
          };
        } catch (error) {
          return {
            user_id: rateLimit.user_id,
            email: 'Unknown',
            ...rateLimit,
          };
        }
      })
    );

    logger.info(`Retrieved ${rateLimits.items.length} rate limits (admin)`);

    res.json({
      items,
      page: rateLimits.page,
      perPage: rateLimits.perPage,
      totalItems: rateLimits.totalItems,
      totalPages: rateLimits.totalPages,
    });
  } catch (error) {
    logger.error(`Admin get rate limits error: ${error.message}`);
    throw error;
  }
});

/**
 * PUT /admin/rate-limits/:userId - Update user's rate limits
 */
router.put('/:userId', requireAdmin, async (req, res) => {
  const { userId } = req.params;
  const { limit_type, limit_value } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (!limit_type || limit_value === undefined) {
    return res.status(400).json({ error: 'limit_type and limit_value are required' });
  }

  const validLimitTypes = ['requests_per_minute', 'requests_per_hour', 'requests_per_day', 'test_runs_per_day', 'agent_installations_per_month'];
  if (!validLimitTypes.includes(limit_type)) {
    return res.status(400).json({ error: `Invalid limit_type. Must be one of: ${validLimitTypes.join(', ')}` });
  }

  try {
    let rateLimitRecord;
    try {
      rateLimitRecord = await pb.collection('rate_limits').getFirstListItem(`user_id = "${userId}"`);
    } catch (error) {
      return res.status(404).json({ error: 'Rate limit record not found for user' });
    }

    const updateData = {
      [limit_type]: limit_value,
    };

    const updatedRateLimit = await pb.collection('rate_limits').update(rateLimitRecord.id, updateData);

    logger.info(`Rate limits updated (admin): user_id=${userId}, ${limit_type}=${limit_value}`);

    res.json({
      success: true,
      rateLimit: updatedRateLimit,
    });
  } catch (error) {
    logger.error(`Admin update rate limits error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /admin/rate-limits/:userId/reset - Reset user's quota
 */
router.post('/:userId/reset', requireAdmin, async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    let rateLimitRecord;
    try {
      rateLimitRecord = await pb.collection('rate_limits').getFirstListItem(`user_id = "${userId}"`);
    } catch (error) {
      return res.status(404).json({ error: 'Rate limit record not found for user' });
    }

    const now = new Date();
    const updatedRateLimit = await pb.collection('rate_limits').update(rateLimitRecord.id, {
      current_minute_count: 0,
      current_hour_count: 0,
      current_day_count: 0,
      minute_reset_at: new Date(now.getTime() + 60000).toISOString(),
      hour_reset_at: new Date(now.getTime() + 3600000).toISOString(),
      day_reset_at: new Date(now.getTime() + 86400000).toISOString(),
    });

    logger.info(`Rate limits reset (admin): user_id=${userId}`);

    res.json({
      success: true,
      message: 'Rate limits reset successfully',
      rateLimit: updatedRateLimit,
    });
  } catch (error) {
    logger.error(`Admin reset rate limits error: ${error.message}`);
    throw error;
  }
});

export default router;
