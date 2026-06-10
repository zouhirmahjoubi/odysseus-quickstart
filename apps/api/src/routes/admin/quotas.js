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
 * GET /admin/quotas - List all quotas
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const quotas = await pb.collection('quotas').getList(page, perPage, {
      sort: '-created',
    });

    logger.info(`Retrieved ${quotas.items.length} quotas (admin)`);

    res.json({
      items: quotas.items,
      page: quotas.page,
      perPage: quotas.perPage,
      totalItems: quotas.totalItems,
      totalPages: quotas.totalPages,
    });
  } catch (error) {
    logger.error(`Admin get quotas error: ${error.message}`);
    throw error;
  }
});

/**
 * PUT /admin/quotas/:userId - Update user's quotas
 */
router.put('/:userId', requireAdmin, async (req, res) => {
  const { userId } = req.params;
  const { apiCallsLimit, testRunsLimit, agentInstallationsLimit } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    let quotaRecord;
    try {
      quotaRecord = await pb.collection('quotas').getFirstListItem(`user_id = "${userId}"`);
    } catch (error) {
      return res.status(404).json({ error: 'Quota record not found for user' });
    }

    const updateData = {};
    if (apiCallsLimit !== undefined) updateData.api_calls_limit = apiCallsLimit;
    if (testRunsLimit !== undefined) updateData.test_runs_limit = testRunsLimit;
    if (agentInstallationsLimit !== undefined) updateData.agent_installations_limit = agentInstallationsLimit;

    const updatedQuota = await pb.collection('quotas').update(quotaRecord.id, updateData);

    logger.info(`Quotas updated (admin): user_id=${userId}`);

    res.json({
      success: true,
      quota: updatedQuota,
    });
  } catch (error) {
    logger.error(`Admin update quotas error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /admin/quotas/violations - Get violations
 */
router.get('/violations', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const violations = await pb.collection('quota_history').getList(page, perPage, {
      filter: `violation = true`,
      sort: '-created',
    });

    logger.info(`Retrieved ${violations.items.length} quota violations (admin)`);

    res.json({
      items: violations.items,
      page: violations.page,
      perPage: violations.perPage,
      totalItems: violations.totalItems,
      totalPages: violations.totalPages,
    });
  } catch (error) {
    logger.error(`Admin get quota violations error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /admin/quotas/stats - Get statistics
 */
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const quotas = await pb.collection('quotas').getFullList();
    const violations = await pb.collection('quota_history').getFullList({
      filter: `violation = true`,
    });

    const totalUsers = quotas.length;
    const usersWithViolations = new Set(violations.map((v) => v.user_id)).size;
    const totalViolations = violations.length;

    logger.info('Admin quota stats retrieved');

    res.json({
      totalUsers,
      usersWithViolations,
      totalViolations,
    });
  } catch (error) {
    logger.error(`Admin quota stats error: ${error.message}`);
    throw error;
  }
});

export default router;
