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
 * GET /admin/cache - Get cache statistics
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    // Get cache statistics from database
    const cacheStats = await pb.collection('cache_statistics').getFullList({
      sort: '-created',
    });

    if (cacheStats.length === 0) {
      logger.info('No cache statistics found');
      return res.json({
        statistics: {
          hitRate: 0,
          missRate: 0,
          totalSize: 0,
          evictions: 0,
          entries: 0,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Get the latest cache statistics
    const latestStats = cacheStats[0];

    const hitRate = latestStats.hit_rate || 0;
    const missRate = latestStats.miss_rate || 0;
    const totalSize = latestStats.total_size || 0;
    const evictions = latestStats.evictions || 0;
    const entries = latestStats.entries || 0;

    logger.info('Admin cache statistics retrieved');

    res.json({
      statistics: {
        hitRate,
        missRate,
        totalSize,
        evictions,
        entries,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error(`Admin get cache statistics error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /admin/cache/clear - Clear cache
 */
router.post('/clear', requireAdmin, async (req, res) => {
  try {
    // Get all cache entries
    const cacheEntries = await pb.collection('cache_entries').getFullList();

    // Delete all cache entries
    for (const entry of cacheEntries) {
      await pb.collection('cache_entries').delete(entry.id);
    }

    // Reset cache statistics
    const cacheStats = await pb.collection('cache_statistics').getFullList();
    for (const stat of cacheStats) {
      await pb.collection('cache_statistics').update(stat.id, {
        hit_rate: 0,
        miss_rate: 0,
        total_size: 0,
        evictions: 0,
        entries: 0,
        cleared_at: new Date().toISOString(),
      });
    }

    logger.info(`Cache cleared: ${cacheEntries.length} entries deleted`);

    res.json({
      success: true,
      message: `Cache cleared successfully. ${cacheEntries.length} entries deleted.`,
      entriesDeleted: cacheEntries.length,
    });
  } catch (error) {
    logger.error(`Admin clear cache error: ${error.message}`);
    throw error;
  }
});

export default router;