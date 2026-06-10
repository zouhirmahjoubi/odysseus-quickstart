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
 * GET /admin/analytics - Get system-wide analytics
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    // Get total users
    const usersCollection = await pb.collection('users').getList(1, 1);
    const totalUsers = usersCollection.totalItems;

    // Get active users (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const activeUsersCollection = await pb.collection('users').getList(1, 1, {
      filter: `updated >= "${thirtyDaysAgo}"`,
    });
    const activeUsers = activeUsersCollection.totalItems;

    // Get total API calls
    const quotaHistory = await pb.collection('quota_history').getFullList({
      filter: `quota_type = "api_calls"`,
    });
    const totalApiCalls = quotaHistory.length;

    // Get total agents
    const agentsCollection = await pb.collection('market_agents').getList(1, 1);
    const totalAgents = agentsCollection.totalItems;

    // Get total teams
    const teamsCollection = await pb.collection('teams').getList(1, 1);
    const totalTeams = teamsCollection.totalItems;

    // Get total revenue
    const ordersCollection = await pb.collection('orders').getFullList({
      filter: `status = "completed"`,
    });
    const totalRevenue = ordersCollection.reduce((sum, order) => sum + (order.total || 0), 0);

    // Get error rate from test runs
    const allTests = await pb.collection('agent_tests').getFullList();
    const errorCount = allTests.filter((t) => t.status === 'error' || t.status === 'failed').length;
    const errorRate = allTests.length > 0 ? Math.round((errorCount / allTests.length) * 100) : 0;

    // Get average response time
    const avgResponseTime = allTests.length > 0 ? Math.round(allTests.reduce((sum, t) => sum + (t.execution_time || 0), 0) / allTests.length) : 0;

    logger.info('Admin analytics retrieved');

    res.json({
      totalUsers,
      activeUsers,
      totalApiCalls,
      totalAgents,
      totalTeams,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalTestRuns: allTests.length,
      errorRate,
      avgResponseTime,
    });
  } catch (error) {
    logger.error(`Admin analytics error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /admin/analytics/users - Get user growth analytics
 */
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const usersOnDate = await pb.collection('users').getList(1, 1, {
        filter: `created >= "${date.toISOString()}" && created < "${nextDate.toISOString()}"`,
      });

      data.push({
        date: dateStr,
        count: usersOnDate.totalItems,
      });
    }

    logger.info('Admin user analytics retrieved');

    res.json({
      data,
      period: '30 days',
    });
  } catch (error) {
    logger.error(`Admin user analytics error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /admin/analytics/revenue - Get revenue analytics
 */
router.get('/revenue', requireAdmin, async (req, res) => {
  try {
    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const ordersOnDate = await pb.collection('orders').getFullList({
        filter: `status = "completed" && created >= "${date.toISOString()}" && created < "${nextDate.toISOString()}"`,
      });

      const revenue = ordersOnDate.reduce((sum, order) => sum + (order.total || 0), 0);

      data.push({
        date: dateStr,
        revenue: Math.round(revenue * 100) / 100,
      });
    }

    logger.info('Admin revenue analytics retrieved');

    res.json({
      data,
      period: '30 days',
    });
  } catch (error) {
    logger.error(`Admin revenue analytics error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /admin/analytics/performance - Get system performance metrics
 */
router.get('/performance', requireAdmin, async (req, res) => {
  try {
    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const testsOnDate = await pb.collection('agent_tests').getFullList({
        filter: `tested_at >= "${date.toISOString()}" && tested_at < "${nextDate.toISOString()}"`,
      });

      let avgResponseTime = 0;
      let errorRate = 0;

      if (testsOnDate.length > 0) {
        const totalTime = testsOnDate.reduce((sum, test) => sum + (test.execution_time || 0), 0);
        avgResponseTime = Math.round(totalTime / testsOnDate.length);

        const errorCount = testsOnDate.filter((t) => t.status === 'error' || t.status === 'failed').length;
        errorRate = Math.round((errorCount / testsOnDate.length) * 100);
      }

      data.push({
        date: dateStr,
        avgResponseTime,
        errorRate,
        testCount: testsOnDate.length,
      });
    }

    logger.info('Admin performance analytics retrieved');

    res.json({
      data,
      period: '30 days',
    });
  } catch (error) {
    logger.error(`Admin performance analytics error: ${error.message}`);
    throw error;
  }
});

export default router;
