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
 * GET /search - Global search across multiple collections
 */
router.get('/', async (req, res) => {
  const { q, type, agent_type, status, category, price_range, date_range, user_role } = req.query;

  if (!q || !q.trim()) {
    return res.status(400).json({ error: 'Search query (q) is required' });
  }

  const query = q.trim().toLowerCase();
  const limit = 20;
  const results = {};

  try {
    // Search agents
    if (!type || type === 'agents') {
      let agentFilter = `name ~ "${query}" || description ~ "${query}"`;
      if (agent_type) agentFilter += ` && type = "${agent_type}"`;
      if (status) agentFilter += ` && status = "${status}"`;
      if (category) agentFilter += ` && category = "${category}"`;
      if (price_range) {
        const [minPrice, maxPrice] = price_range.split('-').map(Number);
        agentFilter += ` && price >= ${minPrice} && price <= ${maxPrice}`;
      }
      if (date_range) {
        const [startDate, endDate] = date_range.split(',');
        agentFilter += ` && created >= "${startDate}" && created <= "${endDate}"`;
      }

      const agents = await pb.collection('market_agents').getList(1, limit, {
        filter: agentFilter,
        sort: '-created',
      });
      results.agents = {
        items: agents.items,
        totalItems: agents.totalItems,
        totalPages: agents.totalPages,
      };
    }

    // Search blog posts
    if (!type || type === 'blog') {
      let blogFilter = `title ~ "${query}" || content ~ "${query}"`;
      if (category) blogFilter += ` && category = "${category}"`;
      if (status) blogFilter += ` && status = "${status}"`;
      if (date_range) {
        const [startDate, endDate] = date_range.split(',');
        blogFilter += ` && created >= "${startDate}" && created <= "${endDate}"`;
      }

      const posts = await pb.collection('blog_posts').getList(1, limit, {
        filter: blogFilter,
        sort: '-created',
      });
      results.blog = {
        items: posts.items,
        totalItems: posts.totalItems,
        totalPages: posts.totalPages,
      };
    }

    // Search products
    if (!type || type === 'products') {
      let productFilter = `name ~ "${query}" || description ~ "${query}"`;
      if (category) productFilter += ` && category = "${category}"`;
      if (status) productFilter += ` && status = "${status}"`;
      if (price_range) {
        const [minPrice, maxPrice] = price_range.split('-').map(Number);
        productFilter += ` && price >= ${minPrice} && price <= ${maxPrice}`;
      }
      if (date_range) {
        const [startDate, endDate] = date_range.split(',');
        productFilter += ` && created >= "${startDate}" && created <= "${endDate}"`;
      }

      const products = await pb.collection('products').getList(1, limit, {
        filter: productFilter,
        sort: '-created',
      });
      results.products = {
        items: products.items,
        totalItems: products.totalItems,
        totalPages: products.totalPages,
      };
    }

    // Search users
    if (!type || type === 'users') {
      let userFilter = `email ~ "${query}" || name ~ "${query}"`;
      if (user_role) userFilter += ` && role = "${user_role}"`;

      const users = await pb.collection('users').getList(1, limit, {
        filter: userFilter,
        sort: '-created',
      });
      results.users = {
        items: users.items.map((u) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          avatar: u.avatar,
        })),
        totalItems: users.totalItems,
        totalPages: users.totalPages,
      };
    }

    // Search teams
    if (!type || type === 'teams') {
      let teamFilter = `name ~ "${query}" || description ~ "${query}"`;

      const teams = await pb.collection('teams').getList(1, limit, {
        filter: teamFilter,
        sort: '-created',
      });
      results.teams = {
        items: teams.items,
        totalItems: teams.totalItems,
        totalPages: teams.totalPages,
      };
    }

    // Search webhooks
    if (!type || type === 'webhooks') {
      let webhookFilter = `url ~ "${query}"`;

      const webhooks = await pb.collection('webhooks').getList(1, limit, {
        filter: webhookFilter,
        sort: '-created',
      });
      results.webhooks = {
        items: webhooks.items,
        totalItems: webhooks.totalItems,
        totalPages: webhooks.totalPages,
      };
    }

    logger.info(`Global search executed: query="${query}", type=${type || 'all'}`);

    res.json({
      query,
      results,
    });
  } catch (error) {
    logger.error(`Search error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /search/agents - Advanced agent search
 */
router.get('/agents', async (req, res) => {
  const { q, type, status, price_range, rating_range, date_range, features, requirements, sort = 'relevance' } = req.query;

  if (!q || !q.trim()) {
    return res.status(400).json({ error: 'Search query (q) is required' });
  }

  const query = q.trim().toLowerCase();
  const page = parseInt(req.query.page) || 1;
  const perPage = 20;

  try {
    let filter = `name ~ "${query}" || description ~ "${query}"`;
    if (type) filter += ` && type = "${type}"`;
    if (status) filter += ` && status = "${status}"`;
    if (price_range) {
      const [minPrice, maxPrice] = price_range.split('-').map(Number);
      filter += ` && price >= ${minPrice} && price <= ${maxPrice}`;
    }
    if (rating_range) {
      const [minRating, maxRating] = rating_range.split('-').map(Number);
      filter += ` && rating >= ${minRating} && rating <= ${maxRating}`;
    }
    if (date_range) {
      const [startDate, endDate] = date_range.split(',');
      filter += ` && created >= "${startDate}" && created <= "${endDate}"`;
    }

    let sortBy = '-created';
    if (sort === 'popularity') sortBy = '-download_count';
    else if (sort === 'rating') sortBy = '-rating';
    else if (sort === 'newest') sortBy = '-created';
    else if (sort === 'price') sortBy = 'price';

    const agents = await pb.collection('market_agents').getList(page, perPage, {
      filter,
      sort: sortBy,
    });

    logger.info(`Agent search executed: query="${query}", page=${page}`);

    res.json({
      items: agents.items,
      page: agents.page,
      perPage: agents.perPage,
      totalItems: agents.totalItems,
      totalPages: agents.totalPages,
    });
  } catch (error) {
    logger.error(`Agent search error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /search/blog - Blog search
 */
router.get('/blog', async (req, res) => {
  const { q, category, tags, author, date_range, status, sort = 'relevance' } = req.query;

  if (!q || !q.trim()) {
    return res.status(400).json({ error: 'Search query (q) is required' });
  }

  const query = q.trim().toLowerCase();
  const page = parseInt(req.query.page) || 1;
  const perPage = 20;

  try {
    let filter = `title ~ "${query}" || content ~ "${query}"`;
    if (category) filter += ` && category = "${category}"`;
    if (author) filter += ` && author = "${author}"`;
    if (status) filter += ` && status = "${status}"`;
    if (date_range) {
      const [startDate, endDate] = date_range.split(',');
      filter += ` && created >= "${startDate}" && created <= "${endDate}"`;
    }

    let sortBy = '-created';
    if (sort === 'date') sortBy = '-created';
    else if (sort === 'popularity') sortBy = '-view_count';

    const posts = await pb.collection('blog_posts').getList(page, perPage, {
      filter,
      sort: sortBy,
    });

    logger.info(`Blog search executed: query="${query}", page=${page}`);

    res.json({
      items: posts.items,
      page: posts.page,
      perPage: posts.perPage,
      totalItems: posts.totalItems,
      totalPages: posts.totalPages,
    });
  } catch (error) {
    logger.error(`Blog search error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /search/products - Product search
 */
router.get('/products', async (req, res) => {
  const { q, category, price_range, status, date_range, sort = 'relevance' } = req.query;

  if (!q || !q.trim()) {
    return res.status(400).json({ error: 'Search query (q) is required' });
  }

  const query = q.trim().toLowerCase();
  const page = parseInt(req.query.page) || 1;
  const perPage = 20;

  try {
    let filter = `name ~ "${query}" || description ~ "${query}"`;
    if (category) filter += ` && category = "${category}"`;
    if (status) filter += ` && status = "${status}"`;
    if (price_range) {
      const [minPrice, maxPrice] = price_range.split('-').map(Number);
      filter += ` && price >= ${minPrice} && price <= ${maxPrice}`;
    }
    if (date_range) {
      const [startDate, endDate] = date_range.split(',');
      filter += ` && created >= "${startDate}" && created <= "${endDate}"`;
    }

    let sortBy = '-created';
    if (sort === 'price') sortBy = 'price';
    else if (sort === 'popularity') sortBy = '-sales_count';
    else if (sort === 'newest') sortBy = '-created';

    const products = await pb.collection('products').getList(page, perPage, {
      filter,
      sort: sortBy,
    });

    logger.info(`Product search executed: query="${query}", page=${page}`);

    res.json({
      items: products.items,
      page: products.page,
      perPage: products.perPage,
      totalItems: products.totalItems,
      totalPages: products.totalPages,
    });
  } catch (error) {
    logger.error(`Product search error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /search/history - Get user's search history
 */
router.get('/history', async (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 50;

    const history = await pb.collection('search_history').getList(page, perPage, {
      filter: `user_id = "${userId}"`,
      sort: '-created',
    });

    logger.info(`Retrieved search history for user ${userId}`);

    res.json({
      items: history.items,
      page: history.page,
      perPage: history.perPage,
      totalItems: history.totalItems,
      totalPages: history.totalPages,
    });
  } catch (error) {
    logger.error(`Get search history error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /search/history - Clear user's search history
 */
router.delete('/history', async (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const history = await pb.collection('search_history').getFullList({
      filter: `user_id = "${userId}"`,
    });

    for (const record of history) {
      await pb.collection('search_history').delete(record.id);
    }

    logger.info(`Cleared search history for user ${userId}`);

    res.json({
      success: true,
      message: `Deleted ${history.length} search history records`,
    });
  } catch (error) {
    logger.error(`Clear search history error: ${error.message}`);
    throw error;
  }
});

export default router;