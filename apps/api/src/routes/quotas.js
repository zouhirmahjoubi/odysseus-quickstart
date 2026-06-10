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
 * GET /quotas - Get user's quotas
 */
router.get('/', requireAuth, async (req, res) => {
  const { userId } = req;

  try {
    // Get or create quota record
    let quotaRecord;
    try {
      quotaRecord = await pb.collection('quotas').getFirstListItem(`user_id = "${userId}"`);
    } catch (error) {
      // Create default quota record
      quotaRecord = await pb.collection('quotas').create({
        user_id: userId,
        api_calls_limit: 100000,
        test_runs_limit: 1000,
        agent_installations_limit: 50,
        api_calls_used: 0,
        test_runs_used: 0,
        agent_installations_used: 0,
        reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    logger.info(`Retrieved quotas for user ${userId}`);

    res.json({
      apiCallsLimit: quotaRecord.api_calls_limit,
      testRunsLimit: quotaRecord.test_runs_limit,
      agentInstallationsLimit: quotaRecord.agent_installations_limit,
    });
  } catch (error) {
    logger.error(`Get quotas error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /quotas/status - Get current usage and remaining quota
 */
router.get('/status', requireAuth, async (req, res) => {
  const { userId } = req;

  try {
    let quotaRecord;
    try {
      quotaRecord = await pb.collection('quotas').getFirstListItem(`user_id = "${userId}"`);
    } catch (error) {
      // Create default quota record
      quotaRecord = await pb.collection('quotas').create({
        user_id: userId,
        api_calls_limit: 100000,
        test_runs_limit: 1000,
        agent_installations_limit: 50,
        api_calls_used: 0,
        test_runs_used: 0,
        agent_installations_used: 0,
        reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    logger.info(`Retrieved quota status for user ${userId}`);

    res.json({
      apiCalls: {
        limit: quotaRecord.api_calls_limit,
        used: quotaRecord.api_calls_used,
        remaining: Math.max(0, quotaRecord.api_calls_limit - quotaRecord.api_calls_used),
        percentage: Math.round((quotaRecord.api_calls_used / quotaRecord.api_calls_limit) * 100),
      },
      testRuns: {
        limit: quotaRecord.test_runs_limit,
        used: quotaRecord.test_runs_used,
        remaining: Math.max(0, quotaRecord.test_runs_limit - quotaRecord.test_runs_used),
        percentage: Math.round((quotaRecord.test_runs_used / quotaRecord.test_runs_limit) * 100),
      },
      agentInstallations: {
        limit: quotaRecord.agent_installations_limit,
        used: quotaRecord.agent_installations_used,
        remaining: Math.max(0, quotaRecord.agent_installations_limit - quotaRecord.agent_installations_used),
        percentage: Math.round((quotaRecord.agent_installations_used / quotaRecord.agent_installations_limit) * 100),
      },
      resetDate: quotaRecord.reset_date,
    });
  } catch (error) {
    logger.error(`Get quota status error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /quotas/history - Get usage history
 */
router.get('/history', requireAuth, async (req, res) => {
  const { userId } = req;

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const history = await pb.collection('quota_history').getList(page, perPage, {
      filter: `user_id = "${userId}"`,
      sort: '-created',
    });

    logger.info(`Retrieved quota history for user ${userId}`);

    res.json({
      items: history.items,
      page: history.page,
      perPage: history.perPage,
      totalItems: history.totalItems,
      totalPages: history.totalPages,
    });
  } catch (error) {
    logger.error(`Get quota history error: ${error.message}`);
    throw error;
  }
});

export default router;
