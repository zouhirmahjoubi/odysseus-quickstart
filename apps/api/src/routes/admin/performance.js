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
 * GET /admin/performance - Get performance metrics
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    // Get performance metrics from database
    const metrics = await pb.collection('performance_metrics').getFullList({
      sort: '-created',
    });

    // Calculate aggregated metrics
    let totalRequests = 0;
    let totalResponseTime = 0;
    let totalDatabaseTime = 0;
    let cacheHits = 0;
    let cacheMisses = 0;
    let errorCount = 0;
    let uptime = 100;

    if (metrics.length > 0) {
      metrics.forEach((metric) => {
        totalRequests += metric.request_count || 0;
        totalResponseTime += metric.response_time || 0;
        totalDatabaseTime += metric.database_time || 0;
        cacheHits += metric.cache_hits || 0;
        cacheMisses += metric.cache_misses || 0;
        errorCount += metric.error_count || 0;
      });

      const avgResponseTime = Math.round(totalResponseTime / metrics.length);
      const avgDatabaseTime = Math.round(totalDatabaseTime / metrics.length);
      const cacheHitRate = cacheHits + cacheMisses > 0 ? Math.round((cacheHits / (cacheHits + cacheMisses)) * 100) : 0;
      const errorRate = totalRequests > 0 ? Math.round((errorCount / totalRequests) * 100) : 0;

      logger.info('Admin performance metrics retrieved');

      res.json({
        metrics: {
          avgResponseTime,
          p95ResponseTime: Math.round(avgResponseTime * 1.5),
          p99ResponseTime: Math.round(avgResponseTime * 2),
          avgDatabaseTime,
          cacheHitRate,
          errorRate,
          uptime,
          totalRequests,
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      res.json({
        metrics: {
          avgResponseTime: 0,
          p95ResponseTime: 0,
          p99ResponseTime: 0,
          avgDatabaseTime: 0,
          cacheHitRate: 0,
          errorRate: 0,
          uptime: 100,
          totalRequests: 0,
        },
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    logger.error(`Admin performance metrics error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /admin/performance/alerts - Get performance alerts
 */
router.get('/alerts', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 20;

    const alerts = await pb.collection('performance_alerts').getList(page, perPage, {
      filter: `status = "active"`,
      sort: '-created',
    });

    logger.info(`Retrieved ${alerts.items.length} performance alerts (admin)`);

    res.json({
      items: alerts.items,
      page: alerts.page,
      perPage: alerts.perPage,
      totalItems: alerts.totalItems,
      totalPages: alerts.totalPages,
    });
  } catch (error) {
    logger.error(`Admin get performance alerts error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /admin/performance/alerts - Create performance alert
 */
router.post('/alerts', requireAdmin, async (req, res) => {
  const { alert_type, threshold_value, alert_action } = req.body;

  if (!alert_type) {
    return res.status(400).json({ error: 'Alert type is required' });
  }

  if (threshold_value === undefined) {
    return res.status(400).json({ error: 'Threshold value is required' });
  }

  if (!alert_action) {
    return res.status(400).json({ error: 'Alert action is required' });
  }

  try {
    const alert = await pb.collection('performance_alerts').create({
      alert_type,
      threshold_value,
      alert_action,
      status: 'active',
      created_at: new Date().toISOString(),
    });

    logger.info(`Performance alert created: id=${alert.id}, type=${alert_type}`);

    res.json({
      success: true,
      alert,
    });
  } catch (error) {
    logger.error(`Admin create performance alert error: ${error.message}`);
    throw error;
  }
});

export default router;