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
 * GET /insights - Get all insights
 */
router.get('/', requireAuth, async (req, res) => {
  const { userId } = req;

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 20;

    // Get key insights
    const insights = {
      topAgents: [],
      activeUsers: 0,
      trendingAgents: [],
      popularPosts: [],
      revenueTrends: [],
      performanceTrends: [],
    };

    // Get top agents
    const topAgentsData = await pb.collection('market_agents').getList(1, 5, {
      filter: `status = "active"`,
      sort: '-download_count',
    });
    insights.topAgents = topAgentsData.items.map((a) => ({
      id: a.id,
      name: a.name,
      downloads: a.download_count || 0,
    }));

    // Get active users count
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const activeUsersData = await pb.collection('users').getList(1, 1, {
      filter: `updated >= "${thirtyDaysAgo}"`,
    });
    insights.activeUsers = activeUsersData.totalItems;

    // Get trending agents
    const trendingAgentsData = await pb.collection('market_agents').getList(1, 5, {
      filter: `status = "active"`,
      sort: '-created',
    });
    insights.trendingAgents = trendingAgentsData.items.map((a) => ({
      id: a.id,
      name: a.name,
      created: a.created,
    }));

    // Get popular blog posts
    const popularPostsData = await pb.collection('blog_posts').getList(1, 5, {
      filter: `status = "published"`,
      sort: '-view_count',
    });
    insights.popularPosts = popularPostsData.items.map((p) => ({
      id: p.id,
      title: p.title,
      views: p.view_count || 0,
    }));

    // Get revenue trends (last 7 days)
    const revenueTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const ordersOnDate = await pb.collection('orders').getFullList({
        filter: `status = "completed" && created >= "${date.toISOString()}" && created < "${nextDate.toISOString()}"`,
      });
      const revenue = ordersOnDate.reduce((sum, order) => sum + (order.total || 0), 0);

      revenueTrends.push({
        date: dateStr,
        revenue: Math.round(revenue * 100) / 100,
      });
    }
    insights.revenueTrends = revenueTrends;

    // Get performance trends (last 7 days)
    const performanceTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const testsOnDate = await pb.collection('agent_tests').getFullList({
        filter: `tested_at >= "${date.toISOString()}" && tested_at < "${nextDate.toISOString()}"`,
      });

      const successCount = testsOnDate.filter((t) => t.status === 'success').length;
      const errorCount = testsOnDate.filter((t) => t.status === 'error' || t.status === 'failed').length;
      const successRate = testsOnDate.length > 0 ? Math.round((successCount / testsOnDate.length) * 100) : 0;

      performanceTrends.push({
        date: dateStr,
        tests: testsOnDate.length,
        successRate,
      });
    }
    insights.performanceTrends = performanceTrends;

    logger.info(`Retrieved insights for user ${userId}`);

    res.json({
      insights,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error(`Get insights error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /insights/:insightId - Get insight details
 */
router.get('/:insightId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { insightId } = req.params;

  if (!insightId) {
    return res.status(400).json({ error: 'Insight ID is required' });
  }

  try {
    const insight = await pb.collection('insights').getOne(insightId);
    if (!insight || insight.user_id !== userId) {
      return res.status(404).json({ error: 'Insight not found or access denied' });
    }

    logger.info(`Retrieved insight ${insightId}`);

    res.json({
      ...insight,
      filters: insight.filters ? JSON.parse(insight.filters) : {},
    });
  } catch (error) {
    logger.error(`Get insight error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /insights - Create custom insight
 */
router.post('/', requireAuth, async (req, res) => {
  const { userId } = req;
  const { name, metric_type, dimension_type, filters, visualization_type } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Insight name is required' });
  }

  if (!metric_type) {
    return res.status(400).json({ error: 'Metric type is required' });
  }

  if (!dimension_type) {
    return res.status(400).json({ error: 'Dimension type is required' });
  }

  try {
    const insight = await pb.collection('insights').create({
      user_id: userId,
      name: name.trim(),
      metric_type,
      dimension_type,
      filters: filters ? JSON.stringify(filters) : '{}',
      visualization_type: visualization_type || 'chart',
      created_at: new Date().toISOString(),
    });

    logger.info(`Insight created: id=${insight.id}, user_id=${userId}`);

    res.json({
      success: true,
      insight,
    });
  } catch (error) {
    logger.error(`Create insight error: ${error.message}`);
    throw error;
  }
});

/**
 * PUT /insights/:insightId - Update insight
 */
router.put('/:insightId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { insightId } = req.params;
  const { name, metric_type, dimension_type, filters, visualization_type } = req.body;

  if (!insightId) {
    return res.status(400).json({ error: 'Insight ID is required' });
  }

  try {
    const insight = await pb.collection('insights').getOne(insightId);
    if (!insight || insight.user_id !== userId) {
      return res.status(404).json({ error: 'Insight not found or access denied' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (metric_type !== undefined) updateData.metric_type = metric_type;
    if (dimension_type !== undefined) updateData.dimension_type = dimension_type;
    if (filters !== undefined) updateData.filters = JSON.stringify(filters);
    if (visualization_type !== undefined) updateData.visualization_type = visualization_type;
    updateData.updated_at = new Date().toISOString();

    const updatedInsight = await pb.collection('insights').update(insightId, updateData);

    logger.info(`Insight updated: id=${insightId}`);

    res.json({
      success: true,
      insight: updatedInsight,
    });
  } catch (error) {
    logger.error(`Update insight error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /insights/:insightId - Delete insight
 */
router.delete('/:insightId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { insightId } = req.params;

  if (!insightId) {
    return res.status(400).json({ error: 'Insight ID is required' });
  }

  try {
    const insight = await pb.collection('insights').getOne(insightId);
    if (!insight || insight.user_id !== userId) {
      return res.status(404).json({ error: 'Insight not found or access denied' });
    }

    await pb.collection('insights').delete(insightId);

    logger.info(`Insight deleted: id=${insightId}`);

    res.json({
      success: true,
      message: 'Insight deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete insight error: ${error.message}`);
    throw error;
  }
});

export default router;