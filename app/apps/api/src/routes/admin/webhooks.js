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
 * GET /admin/webhooks - List all webhooks
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const webhooks = await pb.collection('webhooks').getList(page, perPage, {
      sort: '-created',
    });

    logger.info(`Retrieved ${webhooks.items.length} webhooks (admin)`);

    res.json({
      items: webhooks.items,
      page: webhooks.page,
      perPage: webhooks.perPage,
      totalItems: webhooks.totalItems,
      totalPages: webhooks.totalPages,
    });
  } catch (error) {
    logger.error(`Admin get webhooks error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /admin/webhooks/stats - Get webhook statistics
 */
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const webhooks = await pb.collection('webhooks').getFullList();
    const logs = await pb.collection('webhook_logs').getFullList();

    const totalWebhooks = webhooks.length;
    const activeWebhooks = webhooks.filter((w) => w.active).length;
    const totalDeliveries = logs.length;
    const successfulDeliveries = logs.filter((l) => l.status === 'success').length;
    const failedDeliveries = logs.filter((l) => l.status === 'failed').length;
    const successRate = totalDeliveries > 0 ? Math.round((successfulDeliveries / totalDeliveries) * 100) : 0;

    logger.info('Admin webhook stats retrieved');

    res.json({
      totalWebhooks,
      activeWebhooks,
      totalDeliveries,
      successfulDeliveries,
      failedDeliveries,
      successRate,
    });
  } catch (error) {
    logger.error(`Admin webhook stats error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /admin/webhooks/health - Get webhook health status
 */
router.get('/health', requireAdmin, async (req, res) => {
  try {
    const webhooks = await pb.collection('webhooks').getFullList();
    const health = [];

    for (const webhook of webhooks) {
      const logs = await pb.collection('webhook_logs').getFullList({
        filter: `webhook_id = "${webhook.id}"`,
        sort: '-delivered_at',
      });

      const recentLogs = logs.slice(0, 10);
      const successCount = recentLogs.filter((l) => l.status === 'success').length;
      const healthScore = recentLogs.length > 0 ? Math.round((successCount / recentLogs.length) * 100) : 100;

      health.push({
        id: webhook.id,
        name: webhook.name,
        url: webhook.url,
        active: webhook.active,
        healthScore,
        lastDelivery: recentLogs[0]?.delivered_at || null,
      });
    }

    logger.info('Admin webhook health retrieved');

    res.json({
      webhooks: health,
    });
  } catch (error) {
    logger.error(`Admin webhook health error: ${error.message}`);
    throw error;
  }
});

/**
 * PUT /admin/webhooks/:id/disable - Disable webhook
 */
router.put('/:id/disable', requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Webhook ID is required' });
  }

  try {
    const webhook = await pb.collection('webhooks').getOne(id);
    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    const updatedWebhook = await pb.collection('webhooks').update(id, { active: false });

    logger.info(`Webhook disabled (admin): id=${id}`);

    res.json({
      success: true,
      webhook: updatedWebhook,
    });
  } catch (error) {
    logger.error(`Admin disable webhook error: ${error.message}`);
    throw error;
  }
});

/**
 * PUT /admin/webhooks/:id/enable - Enable webhook
 */
router.put('/:id/enable', requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Webhook ID is required' });
  }

  try {
    const webhook = await pb.collection('webhooks').getOne(id);
    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    const updatedWebhook = await pb.collection('webhooks').update(id, { active: true });

    logger.info(`Webhook enabled (admin): id=${id}`);

    res.json({
      success: true,
      webhook: updatedWebhook,
    });
  } catch (error) {
    logger.error(`Admin enable webhook error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /admin/webhooks/:id/logs - Get webhook logs
 */
router.get('/:id/logs', requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Webhook ID is required' });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const logs = await pb.collection('webhook_logs').getList(page, perPage, {
      filter: `webhook_id = "${id}"`,
      sort: '-delivered_at',
    });

    logger.info(`Retrieved ${logs.items.length} webhook logs (admin)`);

    res.json({
      items: logs.items,
      page: logs.page,
      perPage: logs.perPage,
      totalItems: logs.totalItems,
      totalPages: logs.totalPages,
    });
  } catch (error) {
    logger.error(`Admin get webhook logs error: ${error.message}`);
    throw error;
  }
});

export default router;
