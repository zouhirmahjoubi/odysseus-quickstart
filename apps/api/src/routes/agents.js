import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

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
 * POST /agents - Create new agent
 */
router.post('/', requireAdmin, async (req, res) => {
  const { name, type, category, description, logo, features, requirements, price, billing_type, documentation_url, support_email, status } = req.body;

  // Validate required fields
  if (!name || !type || !category) {
    return res.status(400).json({ error: 'name, type, and category are required' });
  }

  try {
    const agent = await pb.collection('market_agents').create({
      name,
      type,
      category,
      description: description || '',
      logo: logo || '',
      features: features ? JSON.stringify(features) : '[]',
      requirements: requirements ? JSON.stringify(requirements) : '[]',
      price: price || 0,
      billing_type: billing_type || 'one-time',
      documentation_url: documentation_url || '',
      support_email: support_email || '',
      status: status || 'active',
    });

    logger.info(`Agent created: id=${agent.id}, name=${name}`);

    res.json({
      success: true,
      agent,
    });
  } catch (error) {
    logger.error(`Create agent error: ${error.message}`);
    throw error;
  }
});

/**
 * PUT /agents/:id - Update agent
 */
router.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, type, category, description, logo, features, requirements, price, billing_type, documentation_url, support_email, status } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Agent ID is required' });
  }

  try {
    // Check if agent exists
    const agent = await pb.collection('market_agents').getOne(id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Build update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (logo !== undefined) updateData.logo = logo;
    if (features !== undefined) updateData.features = JSON.stringify(features);
    if (requirements !== undefined) updateData.requirements = JSON.stringify(requirements);
    if (price !== undefined) updateData.price = price;
    if (billing_type !== undefined) updateData.billing_type = billing_type;
    if (documentation_url !== undefined) updateData.documentation_url = documentation_url;
    if (support_email !== undefined) updateData.support_email = support_email;
    if (status !== undefined) updateData.status = status;

    const updatedAgent = await pb.collection('market_agents').update(id, updateData);

    logger.info(`Agent updated: id=${id}`);

    res.json({
      success: true,
      agent: updatedAgent,
    });
  } catch (error) {
    logger.error(`Update agent error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /agents/:id - Delete agent
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Agent ID is required' });
  }

  try {
    // Check if agent exists
    const agent = await pb.collection('market_agents').getOne(id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    await pb.collection('market_agents').delete(id);

    logger.info(`Agent deleted: id=${id}`);

    res.json({
      success: true,
      message: 'Agent deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete agent error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /agents/:id/install - Install agent for user
 */
router.post('/:id/install', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!id || !userId) {
    return res.status(400).json({ error: 'Agent ID and user ID are required' });
  }

  try {
    // Check if agent exists
    const agent = await pb.collection('market_agents').getOne(id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Check if user exists
    const user = await pb.collection('users').getOne(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already installed
    try {
      const existing = await pb.collection('user_agents').getFirstListItem(`agent_id = "${id}" && user_id = "${userId}"`);
      return res.status(400).json({ error: 'Agent already installed for this user' });
    } catch (error) {
      // Not installed, continue
    }

    // Create user_agents record
    const userAgent = await pb.collection('user_agents').create({
      agent_id: id,
      user_id: userId,
      status: 'inactive',
      installed_at: new Date().toISOString(),
    });

    logger.info(`Agent installed: agent_id=${id}, user_id=${userId}`);

    res.json({
      success: true,
      message: 'Agent installed successfully',
      userAgent,
    });
  } catch (error) {
    logger.error(`Install agent error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /agents/:id/test - Test agent with input
 */
router.post('/:id/test', async (req, res) => {
  const { id } = req.params;
  const { userId, testInput } = req.body;

  if (!id || !userId || !testInput) {
    return res.status(400).json({ error: 'Agent ID, user ID, and test input are required' });
  }

  try {
    // Check if agent exists
    const agent = await pb.collection('market_agents').getOne(id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Check if user has installed the agent
    const userAgent = await pb.collection('user_agents').getFirstListItem(`agent_id = "${id}" && user_id = "${userId}"`);
    if (!userAgent) {
      return res.status(400).json({ error: 'Agent not installed for this user' });
    }

    // Simulate agent execution
    const startTime = Date.now();
    const output = `Test output for agent ${agent.name} with input: ${testInput}`;
    const executionTime = Date.now() - startTime;
    const tokenUsage = Math.floor(Math.random() * 1000) + 100;

    // Create test record
    const testRecord = await pb.collection('agent_tests').create({
      agent_id: id,
      user_id: userId,
      test_input: testInput,
      output,
      execution_time: executionTime,
      token_usage: tokenUsage,
      status: 'success',
      tested_at: new Date().toISOString(),
    });

    logger.info(`Agent test executed: agent_id=${id}, user_id=${userId}, execution_time=${executionTime}ms`);

    res.json({
      success: true,
      testId: testRecord.id,
      output,
      executionTime,
      tokenUsage,
    });
  } catch (error) {
    logger.error(`Test agent error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /agents/:id/test-history - Get test history for agent
 */
router.get('/:id/test-history', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  if (!id || !userId) {
    return res.status(400).json({ error: 'Agent ID and user ID are required' });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const testHistory = await pb.collection('agent_tests').getList(page, perPage, {
      filter: `agent_id = "${id}" && user_id = "${userId}"`,
      sort: '-tested_at',
    });

    logger.info(`Retrieved test history for agent ${id}, user ${userId}`);

    res.json({
      items: testHistory.items,
      page: testHistory.page,
      perPage: testHistory.perPage,
      totalItems: testHistory.totalItems,
      totalPages: testHistory.totalPages,
    });
  } catch (error) {
    logger.error(`Get test history error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /agents/:id/test-history/:testId - Delete test record
 */
router.delete('/:id/test-history/:testId', async (req, res) => {
  const { id, testId } = req.params;
  const { userId } = req.query;

  if (!id || !testId || !userId) {
    return res.status(400).json({ error: 'Agent ID, test ID, and user ID are required' });
  }

  try {
    // Check if test record exists and belongs to user
    const testRecord = await pb.collection('agent_tests').getOne(testId);
    if (!testRecord || testRecord.agent_id !== id || testRecord.user_id !== userId) {
      return res.status(404).json({ error: 'Test record not found or access denied' });
    }

    await pb.collection('agent_tests').delete(testId);

    logger.info(`Test record deleted: test_id=${testId}`);

    res.json({
      success: true,
      message: 'Test record deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete test record error: ${error.message}`);
    throw error;
  }
});

export default router;
