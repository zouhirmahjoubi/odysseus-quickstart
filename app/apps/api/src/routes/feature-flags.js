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
 * GET /feature-flags - List feature flags with pagination
 */
router.get('/', requireAuth, async (req, res) => {
  const { userId } = req;
  const { status } = req.query;

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    let filter = `user_id = "${userId}"`;
    if (status) filter += ` && status = "${status}"`;

    const flags = await pb.collection('feature_flags').getList(page, perPage, {
      filter,
      sort: '-created',
    });

    const items = flags.items.map((flag) => ({
      id: flag.id,
      name: flag.name,
      description: flag.description,
      type: flag.type,
      status: flag.status,
      rollout_percentage: flag.rollout_percentage || 0,
      created_date: flag.created,
    }));

    logger.info(`Retrieved ${flags.items.length} feature flags for user ${userId}`);

    res.json({
      items,
      page: flags.page,
      perPage: flags.perPage,
      totalItems: flags.totalItems,
      totalPages: flags.totalPages,
    });
  } catch (error) {
    logger.error(`Get feature flags error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /feature-flags - Create feature flag
 */
router.post('/', requireAuth, async (req, res) => {
  const { userId } = req;
  const { name, description, type, rollout_percentage, segments, status = 'disabled' } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Flag name is required' });
  }

  if (!type) {
    return res.status(400).json({ error: 'Flag type is required' });
  }

  if (rollout_percentage !== undefined && (rollout_percentage < 0 || rollout_percentage > 100)) {
    return res.status(400).json({ error: 'Rollout percentage must be between 0 and 100' });
  }

  try {
    const flag = await pb.collection('feature_flags').create({
      user_id: userId,
      name: name.trim(),
      description: description ? description.trim() : '',
      type,
      rollout_percentage: rollout_percentage || 0,
      segments: segments ? JSON.stringify(segments) : '[]',
      status,
      created_at: new Date().toISOString(),
    });

    logger.info(`Feature flag created: id=${flag.id}, user_id=${userId}`);

    res.json({
      success: true,
      flag: {
        id: flag.id,
        name: flag.name,
        description: flag.description,
        type: flag.type,
        status: flag.status,
        rollout_percentage: flag.rollout_percentage,
        created_date: flag.created,
      },
    });
  } catch (error) {
    logger.error(`Create feature flag error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /feature-flags/:flagId/status/:userId - Check if flag is enabled for user
 */
router.get('/:flagId/status/:userId', async (req, res) => {
  const { flagId, userId } = req.params;

  if (!flagId || !userId) {
    return res.status(400).json({ error: 'Flag ID and user ID are required' });
  }

  try {
    const flag = await pb.collection('feature_flags').getOne(flagId);
    if (!flag) {
      return res.status(404).json({ error: 'Feature flag not found' });
    }

    // Check if flag is enabled
    if (flag.status !== 'enabled') {
      return res.json({
        flag_id: flagId,
        user_id: userId,
        enabled: false,
        reason: 'flag_disabled',
      });
    }

    // Check rollout percentage
    if (flag.rollout_percentage < 100) {
      const hash = hashUserId(userId, flagId);
      const isEnabled = hash % 100 < flag.rollout_percentage;
      
      if (!isEnabled) {
        return res.json({
          flag_id: flagId,
          user_id: userId,
          enabled: false,
          reason: 'rollout_percentage',
        });
      }
    }

    // Check segment membership
    const segments = flag.segments ? JSON.parse(flag.segments) : [];
    if (segments.length > 0) {
      let inSegment = false;
      for (const segmentId of segments) {
        try {
          const member = await pb.collection('segment_members').getFirstListItem(
            `segment_id = "${segmentId}" && user_id = "${userId}"`
          );
          if (member) {
            inSegment = true;
            break;
          }
        } catch (error) {
          // User not in segment
        }
      }
      
      if (!inSegment) {
        return res.json({
          flag_id: flagId,
          user_id: userId,
          enabled: false,
          reason: 'not_in_segment',
        });
      }
    }

    logger.info(`Feature flag status checked: flag_id=${flagId}, user_id=${userId}, enabled=true`);

    res.json({
      flag_id: flagId,
      user_id: userId,
      enabled: true,
      reason: 'all_checks_passed',
    });
  } catch (error) {
    logger.error(`Check feature flag status error: ${error.message}`);
    throw error;
  }
});

// Helper function to hash user ID for consistent rollout
function hashUserId(userId, flagId) {
  const crypto = require('crypto');
  const hash = crypto.createHash('md5').update(`${userId}:${flagId}`).digest('hex');
  return parseInt(hash.substring(0, 8), 16);
}

export default router;