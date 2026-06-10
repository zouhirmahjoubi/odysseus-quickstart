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
 * GET /recommendations/agents - Get recommended agents
 */
router.get('/agents', requireAuth, async (req, res) => {
  const { userId } = req;
  const limit = parseInt(req.query.limit) || 10;

  try {
    // Get user's installed agents
    const userAgents = await pb.collection('user_agents').getFullList({
      filter: `user_id = "${userId}"`,
    });
    const installedAgentIds = userAgents.map((ua) => ua.agent_id);

    // Get all agents
    const allAgents = await pb.collection('market_agents').getFullList({
      filter: `status = "active"`,
    });

    // Filter out already installed agents
    const recommendedAgents = allAgents
      .filter((agent) => !installedAgentIds.includes(agent.id))
      .slice(0, limit)
      .map((agent) => ({
        agent_id: agent.id,
        name: agent.name,
        score: Math.random() * 100, // Placeholder scoring
        reason: 'Based on your interests',
      }));

    logger.info(`Retrieved agent recommendations for user ${userId}`);

    res.json({
      recommendations: recommendedAgents,
      count: recommendedAgents.length,
    });
  } catch (error) {
    logger.error(`Get agent recommendations error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /recommendations/blog - Get recommended blog posts
 */
router.get('/blog', requireAuth, async (req, res) => {
  const { userId } = req;
  const limit = parseInt(req.query.limit) || 10;

  try {
    // Get user's reading history
    const readingHistory = await pb.collection('blog_views').getFullList({
      filter: `user_id = "${userId}"`,
    });
    const viewedPostIds = readingHistory.map((v) => v.post_id);

    // Get popular blog posts
    const popularPosts = await pb.collection('blog_posts').getFullList({
      filter: `status = "published"`,
      sort: '-view_count',
    });

    // Filter out already viewed posts
    const recommendedPosts = popularPosts
      .filter((post) => !viewedPostIds.includes(post.id))
      .slice(0, limit)
      .map((post) => ({
        post_id: post.id,
        title: post.title,
        score: Math.random() * 100,
        reason: 'Popular in your interests',
      }));

    logger.info(`Retrieved blog recommendations for user ${userId}`);

    res.json({
      recommendations: recommendedPosts,
      count: recommendedPosts.length,
    });
  } catch (error) {
    logger.error(`Get blog recommendations error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /recommendations/products - Get recommended products
 */
router.get('/products', requireAuth, async (req, res) => {
  const { userId } = req;
  const limit = parseInt(req.query.limit) || 10;

  try {
    // Get user's purchase history
    const orders = await pb.collection('orders').getFullList({
      filter: `customerId = "${userId}" && status = "completed"`,
    });

    // Get popular products
    const popularProducts = await pb.collection('products').getFullList({
      filter: `status = "active"`,
      sort: '-sales_count',
    });

    // Filter out already purchased products
    const purchasedProductIds = new Set();
    orders.forEach((order) => {
      try {
        const items = JSON.parse(order.items || '[]');
        items.forEach((item) => purchasedProductIds.add(item.productId));
      } catch (e) {
        // Skip parsing errors
      }
    });

    const recommendedProducts = Array.from(popularProducts)
      .filter((product) => !purchasedProductIds.has(product.id))
      .slice(0, limit)
      .map((product) => ({
        product_id: product.id,
        name: product.name,
        score: Math.random() * 100,
        reason: 'Popular in your category',
      }));

    logger.info(`Retrieved product recommendations for user ${userId}`);

    res.json({
      recommendations: recommendedProducts,
      count: recommendedProducts.length,
    });
  } catch (error) {
    logger.error(`Get product recommendations error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /recommendations/workflows - Get recommended workflows
 */
router.get('/workflows', requireAuth, async (req, res) => {
  const { userId } = req;
  const limit = parseInt(req.query.limit) || 10;

  try {
    // Get user's workflows
    const userWorkflows = await pb.collection('workflows').getFullList({
      filter: `user_id = "${userId}"`,
    });
    const userWorkflowIds = userWorkflows.map((w) => w.id);

    // Get popular workflows
    const popularWorkflows = await pb.collection('workflows').getFullList({
      filter: `status = "published"`,
      sort: '-usage_count',
    });

    // Filter out user's own workflows
    const recommendedWorkflows = popularWorkflows
      .filter((workflow) => !userWorkflowIds.includes(workflow.id))
      .slice(0, limit)
      .map((workflow) => ({
        workflow_id: workflow.id,
        name: workflow.name,
        score: Math.random() * 100,
        reason: 'Popular workflow template',
      }));

    logger.info(`Retrieved workflow recommendations for user ${userId}`);

    res.json({
      recommendations: recommendedWorkflows,
      count: recommendedWorkflows.length,
    });
  } catch (error) {
    logger.error(`Get workflow recommendations error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /recommendations/feedback - Submit recommendation feedback
 */
router.post('/feedback', requireAuth, async (req, res) => {
  const { userId } = req;
  const { recommendation_id, feedback } = req.body;

  if (!recommendation_id || !feedback) {
    return res.status(400).json({ error: 'recommendation_id and feedback are required' });
  }

  if (!['like', 'dislike', 'ignore'].includes(feedback)) {
    return res.status(400).json({ error: 'feedback must be like, dislike, or ignore' });
  }

  try {
    const feedbackRecord = await pb.collection('recommendation_feedback').create({
      user_id: userId,
      recommendation_id,
      feedback,
      created_at: new Date().toISOString(),
    });

    logger.info(`Recommendation feedback submitted: user_id=${userId}, feedback=${feedback}`);

    res.json({
      success: true,
      feedback_id: feedbackRecord.id,
    });
  } catch (error) {
    logger.error(`Submit recommendation feedback error: ${error.message}`);
    throw error;
  }
});

export default router;