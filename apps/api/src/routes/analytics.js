import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { quotaTrackingMiddleware } from '../middleware/quota-tracking.js';

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
 * GET /analytics - Get user analytics with date range and filters
 */
router.get('/', requireAuth, quotaTrackingMiddleware, async (req, res) => {
  const { userId } = req;
  const { startDate, endDate, agentId, userId: filterUserId } = req.query;

  try {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Build filter
    let filter = `user_id = "${userId}" && created >= "${start.toISOString()}" && created < "${end.toISOString()}"`;
    if (agentId) filter += ` && agent_id = "${agentId}"`;

    // Get quota history for API calls
    const apiCallsHistory = await pb.collection('quota_history').getFullList({
      filter: `${filter} && quota_type = "api_calls"`,
    });

    // Get agent installations
    const agentInstallations = await pb.collection('quota_history').getFullList({
      filter: `${filter} && quota_type = "agent_installations"`,
    });

    // Get test runs
    const testRuns = await pb.collection('quota_history').getFullList({
      filter: `${filter} && quota_type = "test_runs"`,
    });

    // Get user agents for agent count
    const userAgents = await pb.collection('user_agents').getFullList({
      filter: `user_id = "${userId}"`,
    });

    // Get orders for revenue
    const orders = await pb.collection('orders').getFullList({
      filter: `customerId = "${userId}" && status = "completed" && created >= "${start.toISOString()}" && created < "${end.toISOString()}"`,
    });

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Calculate daily breakdown
    const dailyBreakdown = {};
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dailyBreakdown[dateStr] = {
        apiCalls: 0,
        agentInstallations: 0,
        testRuns: 0,
      };
    }

    apiCallsHistory.forEach((record) => {
      const dateStr = new Date(record.created).toISOString().split('T')[0];
      if (dailyBreakdown[dateStr]) dailyBreakdown[dateStr].apiCalls += 1;
    });

    agentInstallations.forEach((record) => {
      const dateStr = new Date(record.created).toISOString().split('T')[0];
      if (dailyBreakdown[dateStr]) dailyBreakdown[dateStr].agentInstallations += 1;
    });

    testRuns.forEach((record) => {
      const dateStr = new Date(record.created).toISOString().split('T')[0];
      if (dailyBreakdown[dateStr]) dailyBreakdown[dateStr].testRuns += 1;
    });

    logger.info(`Analytics retrieved for user ${userId}`);

    res.json({
      period: {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      },
      summary: {
        totalApiCalls: apiCallsHistory.length,
        totalAgentInstallations: agentInstallations.length,
        totalTestRuns: testRuns.length,
        totalAgentsInstalled: userAgents.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
      },
      dailyBreakdown,
    });
  } catch (error) {
    logger.error(`Analytics error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /analytics/agents/:agentId - Get agent-specific analytics
 */
router.get('/agents/:agentId', requireAuth, quotaTrackingMiddleware, async (req, res) => {
  const { userId } = req;
  const { agentId } = req.params;
  const { startDate, endDate } = req.query;

  if (!agentId) {
    return res.status(400).json({ error: 'Agent ID is required' });
  }

  try {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get agent tests
    const tests = await pb.collection('agent_tests').getFullList({
      filter: `agent_id = "${agentId}" && user_id = "${userId}" && tested_at >= "${start.toISOString()}" && tested_at < "${end.toISOString()}"`,
    });

    // Calculate metrics
    const successCount = tests.filter((t) => t.status === 'success').length;
    const errorCount = tests.filter((t) => t.status === 'error' || t.status === 'failed').length;
    const successRate = tests.length > 0 ? Math.round((successCount / tests.length) * 100) : 0;
    const errorRate = tests.length > 0 ? Math.round((errorCount / tests.length) * 100) : 0;

    const avgResponseTime = tests.length > 0 ? Math.round(tests.reduce((sum, t) => sum + (t.execution_time || 0), 0) / tests.length) : 0;
    const totalTokenUsage = tests.reduce((sum, t) => sum + (t.token_usage || 0), 0);

    // Get top users
    const userTests = {};
    tests.forEach((test) => {
      if (!userTests[test.user_id]) {
        userTests[test.user_id] = 0;
      }
      userTests[test.user_id] += 1;
    });

    const topUsers = Object.entries(userTests)
      .map(([uid, count]) => ({ userId: uid, testCount: count }))
      .sort((a, b) => b.testCount - a.testCount)
      .slice(0, 10);

    // Time-series data (daily)
    const timeSeries = {};
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      timeSeries[dateStr] = {
        tests: 0,
        successCount: 0,
        errorCount: 0,
        avgResponseTime: 0,
      };
    }

    tests.forEach((test) => {
      const dateStr = new Date(test.tested_at).toISOString().split('T')[0];
      if (timeSeries[dateStr]) {
        timeSeries[dateStr].tests += 1;
        if (test.status === 'success') timeSeries[dateStr].successCount += 1;
        if (test.status === 'error' || test.status === 'failed') timeSeries[dateStr].errorCount += 1;
      }
    });

    logger.info(`Agent analytics retrieved: agent_id=${agentId}, user_id=${userId}`);

    res.json({
      agentId,
      period: {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      },
      summary: {
        totalTests: tests.length,
        successCount,
        errorCount,
        successRate,
        errorRate,
        avgResponseTime,
        totalTokenUsage,
      },
      timeSeries,
      topUsers,
    });
  } catch (error) {
    logger.error(`Agent analytics error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /analytics/export - Export analytics as CSV, PDF, or JSON
 */
router.get('/export', requireAuth, quotaTrackingMiddleware, async (req, res) => {
  const { userId } = req;
  const { format = 'json', startDate, endDate, metrics = 'all' } = req.query;

  if (!['csv', 'pdf', 'json'].includes(format)) {
    return res.status(400).json({ error: 'Format must be csv, pdf, or json' });
  }

  try {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get analytics data
    const quotaHistory = await pb.collection('quota_history').getFullList({
      filter: `user_id = "${userId}" && created >= "${start.toISOString()}" && created < "${end.toISOString()}"`,
    });

    const orders = await pb.collection('orders').getFullList({
      filter: `customerId = "${userId}" && status = "completed" && created >= "${start.toISOString()}" && created < "${end.toISOString()}"`,
    });

    const data = {
      userId,
      exportDate: new Date().toISOString(),
      period: {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      },
      quotaHistory,
      orders,
    };

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="analytics-${userId}-${Date.now()}.json"`);
      res.json(data);
    } else if (format === 'csv') {
      // Convert to CSV
      let csv = 'Type,Date,Quota Type,Usage Before,Usage After,Limit,Violation\n';
      quotaHistory.forEach((record) => {
        csv += `quota,${record.created},${record.quota_type},${record.usage_before},${record.usage_after},${record.limit},${record.violation}\n`;
      });

      csv += '\nOrders\n';
      csv += 'Order ID,Date,Total,Status\n';
      orders.forEach((order) => {
        csv += `${order.orderId},${order.created},${order.total},${order.status}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="analytics-${userId}-${Date.now()}.csv"`);
      res.send(csv);
    } else if (format === 'pdf') {
      // PDF export would require a PDF library like pdfkit
      // For now, return JSON with note about PDF
      res.json({
        message: 'PDF export requires additional setup',
        data,
      });
    }

    logger.info(`Analytics exported: user_id=${userId}, format=${format}`);
  } catch (error) {
    logger.error(`Analytics export error: ${error.message}`);
    throw error;
  }
});

export default router;
