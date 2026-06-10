import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { generateToken } from '../utils/crypto.js';
import crypto from 'crypto';

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

// Helper function to validate webhook URL
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * GET /webhooks - List user's webhooks
 */
router.get('/', requireAuth, async (req, res) => {
  const { userId } = req;

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const webhooks = await pb.collection('webhooks').getList(page, perPage, {
      filter: `user_id = "${userId}"`,
      sort: '-created',
    });

    const items = webhooks.items.map((webhook) => ({
      webhook_id: webhook.id,
      url: webhook.url,
      events: webhook.events ? JSON.parse(webhook.events) : [],
      status: webhook.active ? 'active' : 'inactive',
      last_triggered: webhook.lastTriggeredAt || null,
      last_response_status: webhook.lastResponseStatus || null,
      created_date: webhook.created,
    }));

    logger.info(`Retrieved ${webhooks.items.length} webhooks for user ${userId}`);

    res.json({
      items,
      page: webhooks.page,
      perPage: webhooks.perPage,
      totalItems: webhooks.totalItems,
      totalPages: webhooks.totalPages,
    });
  } catch (error) {
    logger.error(`Get webhooks error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /webhooks - Create webhook
 */
router.post('/', requireAuth, async (req, res) => {
  const { userId } = req;
  const { url, events, active = true, headers = {}, retryPolicy = {} } = req.body;

  // Validate required fields
  if (!url || !url.trim()) {
    return res.status(400).json({ error: 'Webhook URL is required' });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid webhook URL format' });
  }

  if (!events || !Array.isArray(events) || events.length === 0) {
    return res.status(400).json({ error: 'At least one event must be selected' });
  }

  const validEvents = ['agent.installed', 'agent.tested', 'order.completed', 'user.created', 'test.event'];
  for (const event of events) {
    if (!validEvents.includes(event)) {
      return res.status(400).json({ error: `Invalid event: ${event}` });
    }
  }

  try {
    const secret = generateToken(32);

    const webhook = await pb.collection('webhooks').create({
      user_id: userId,
      url: url.trim(),
      events: JSON.stringify(events),
      active,
      headers: JSON.stringify(headers),
      retryPolicy: JSON.stringify({
        maxRetries: retryPolicy.maxRetries || 3,
        retryDelay: retryPolicy.retryDelay || 5000,
        exponentialBackoff: retryPolicy.exponentialBackoff !== false,
      }),
      secret,
      lastTriggeredAt: null,
      lastResponseStatus: null,
    });

    logger.info(`Webhook created: id=${webhook.id}, user_id=${userId}`);

    res.json({
      success: true,
      webhook: {
        webhook_id: webhook.id,
        url: webhook.url,
        events: JSON.parse(webhook.events),
        active: webhook.active,
        secret,
        created_date: webhook.created,
        warning: 'Save this secret in a safe place. You will not be able to see it again.',
      },
    });
  } catch (error) {
    logger.error(`Create webhook error: ${error.message}`);
    throw error;
  }
});

/**
 * PUT /webhooks/:webhookId - Update webhook
 */
router.put('/:webhookId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { webhookId } = req.params;
  const { url, events, active, headers, retryPolicy } = req.body;

  if (!webhookId) {
    return res.status(400).json({ error: 'Webhook ID is required' });
  }

  try {
    // Check if webhook exists and belongs to user
    const webhook = await pb.collection('webhooks').getOne(webhookId);
    if (!webhook || webhook.user_id !== userId) {
      return res.status(404).json({ error: 'Webhook not found or access denied' });
    }

    // Validate URL if provided
    if (url && !isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid webhook URL format' });
    }

    // Validate events if provided
    if (events) {
      if (!Array.isArray(events) || events.length === 0) {
        return res.status(400).json({ error: 'At least one event must be selected' });
      }
      const validEvents = ['agent.installed', 'agent.tested', 'order.completed', 'user.created', 'test.event'];
      for (const event of events) {
        if (!validEvents.includes(event)) {
          return res.status(400).json({ error: `Invalid event: ${event}` });
        }
      }
    }

    // Build update data
    const updateData = {};
    if (url !== undefined) updateData.url = url.trim();
    if (events !== undefined) updateData.events = JSON.stringify(events);
    if (active !== undefined) updateData.active = active;
    if (headers !== undefined) updateData.headers = JSON.stringify(headers);
    if (retryPolicy !== undefined) {
      updateData.retryPolicy = JSON.stringify({
        maxRetries: retryPolicy.maxRetries || 3,
        retryDelay: retryPolicy.retryDelay || 5000,
        exponentialBackoff: retryPolicy.exponentialBackoff !== false,
      });
    }

    const updatedWebhook = await pb.collection('webhooks').update(webhookId, updateData);

    logger.info(`Webhook updated: id=${webhookId}`);

    res.json({
      success: true,
      webhook: {
        webhook_id: updatedWebhook.id,
        url: updatedWebhook.url,
        events: JSON.parse(updatedWebhook.events),
        active: updatedWebhook.active,
      },
    });
  } catch (error) {
    logger.error(`Update webhook error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /webhooks/:webhookId - Delete webhook
 */
router.delete('/:webhookId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { webhookId } = req.params;

  if (!webhookId) {
    return res.status(400).json({ error: 'Webhook ID is required' });
  }

  try {
    // Check if webhook exists and belongs to user
    const webhook = await pb.collection('webhooks').getOne(webhookId);
    if (!webhook || webhook.user_id !== userId) {
      return res.status(404).json({ error: 'Webhook not found or access denied' });
    }

    await pb.collection('webhooks').delete(webhookId);

    logger.info(`Webhook deleted: id=${webhookId}`);

    res.json({
      success: true,
      message: 'Webhook deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete webhook error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /webhooks/:webhookId/test - Test webhook
 */
router.post('/:webhookId/test', requireAuth, async (req, res) => {
  const { userId } = req;
  const { webhookId } = req.params;
  const { eventType = 'test.event' } = req.body;

  if (!webhookId) {
    return res.status(400).json({ error: 'Webhook ID is required' });
  }

  try {
    // Check if webhook exists and belongs to user
    const webhook = await pb.collection('webhooks').getOne(webhookId);
    if (!webhook || webhook.user_id !== userId) {
      return res.status(404).json({ error: 'Webhook not found or access denied' });
    }

    // Create test payload
    const testPayload = {
      event: eventType,
      timestamp: new Date().toISOString(),
      user_id: userId,
      data: {
        message: 'This is a test webhook delivery',
      },
    };

    // Sign payload
    const signature = crypto
      .createHmac('sha256', webhook.secret)
      .update(JSON.stringify(testPayload))
      .digest('hex');

    // Send webhook
    const startTime = Date.now();
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        ...JSON.parse(webhook.headers || '{}'),
      },
      body: JSON.stringify(testPayload),
    });
    const responseTime = Date.now() - startTime;

    // Log delivery
    const logEntry = await pb.collection('webhook_logs').create({
      webhook_id: webhookId,
      user_id: userId,
      event: eventType,
      status: response.ok ? 'success' : 'failed',
      status_code: response.status,
      response_time: responseTime,
      delivered_at: new Date().toISOString(),
    });

    logger.info(`Test webhook sent: webhook_id=${webhookId}, status=${response.status}`);

    res.json({
      success: true,
      status: response.status,
      responseTime,
      logId: logEntry.id,
    });
  } catch (error) {
    logger.error(`Test webhook error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /webhooks/:webhookId/logs - List webhook delivery logs
 */
router.get('/:webhookId/logs', requireAuth, async (req, res) => {
  const { userId } = req;
  const { webhookId } = req.params;
  const { status, startDate, endDate } = req.query;

  if (!webhookId) {
    return res.status(400).json({ error: 'Webhook ID is required' });
  }

  try {
    // Check if webhook exists and belongs to user
    const webhook = await pb.collection('webhooks').getOne(webhookId);
    if (!webhook || webhook.user_id !== userId) {
      return res.status(404).json({ error: 'Webhook not found or access denied' });
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    let filter = `webhook_id = "${webhookId}"`;
    if (status) filter += ` && status = "${status}"`;
    if (startDate) filter += ` && delivered_at >= "${new Date(startDate).toISOString()}"`;
    if (endDate) filter += ` && delivered_at < "${new Date(endDate).toISOString()}"`;

    const logs = await pb.collection('webhook_logs').getList(page, perPage, {
      filter,
      sort: '-delivered_at',
    });

    logger.info(`Retrieved ${logs.items.length} webhook logs for webhook ${webhookId}`);

    res.json({
      items: logs.items,
      page: logs.page,
      perPage: logs.perPage,
      totalItems: logs.totalItems,
      totalPages: logs.totalPages,
    });
  } catch (error) {
    logger.error(`Get webhook logs error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /webhooks/:webhookId/logs/:logId/retry - Retry failed webhook delivery
 */
router.post('/:webhookId/logs/:logId/retry', requireAuth, async (req, res) => {
  const { userId } = req;
  const { webhookId, logId } = req.params;

  if (!webhookId || !logId) {
    return res.status(400).json({ error: 'Webhook ID and log ID are required' });
  }

  try {
    // Check if webhook exists and belongs to user
    const webhook = await pb.collection('webhooks').getOne(webhookId);
    if (!webhook || webhook.user_id !== userId) {
      return res.status(404).json({ error: 'Webhook not found or access denied' });
    }

    // Check if log exists and belongs to webhook
    const log = await pb.collection('webhook_logs').getOne(logId);
    if (!log || log.webhook_id !== webhookId) {
      return res.status(404).json({ error: 'Log not found or access denied' });
    }

    // Reconstruct payload and retry
    const testPayload = {
      event: log.event,
      timestamp: log.delivered_at,
      user_id: userId,
      data: log.data ? JSON.parse(log.data) : {},
    };

    const signature = crypto
      .createHmac('sha256', webhook.secret)
      .update(JSON.stringify(testPayload))
      .digest('hex');

    const startTime = Date.now();
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        ...JSON.parse(webhook.headers || '{}'),
      },
      body: JSON.stringify(testPayload),
    });
    const responseTime = Date.now() - startTime;

    // Update log
    await pb.collection('webhook_logs').update(logId, {
      status: response.ok ? 'success' : 'failed',
      status_code: response.status,
      response_time: responseTime,
      retry_count: (log.retry_count || 0) + 1,
    });

    logger.info(`Webhook retry sent: webhook_id=${webhookId}, log_id=${logId}, status=${response.status}`);

    res.json({
      success: true,
      status: response.status,
      responseTime,
    });
  } catch (error) {
    logger.error(`Webhook retry error: ${error.message}`);
    throw error;
  }
});

export default router;
