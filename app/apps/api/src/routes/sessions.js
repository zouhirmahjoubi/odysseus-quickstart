import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /sessions - Get active sessions for user
 */
router.get('/', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const sessions = await pb.collection('user_sessions').getList(page, perPage, {
      filter: `user_id = "${userId}"`,
      sort: '-last_activity',
    });

    logger.info(`Retrieved sessions for user ${userId}`);

    res.json({
      items: sessions.items,
      page: sessions.page,
      perPage: sessions.perPage,
      totalItems: sessions.totalItems,
      totalPages: sessions.totalPages,
    });
  } catch (error) {
    logger.error(`Get sessions error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /sessions/:sessionId - Delete session
 */
router.delete('/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const { userId } = req.query;

  if (!sessionId || !userId) {
    return res.status(400).json({ error: 'sessionId and userId are required' });
  }

  try {
    // Check if session exists and belongs to user
    const session = await pb.collection('user_sessions').getOne(sessionId);
    if (!session || session.user_id !== userId) {
      return res.status(404).json({ error: 'Session not found or access denied' });
    }

    await pb.collection('user_sessions').delete(sessionId);

    logger.info(`Session deleted: session_id=${sessionId}`);

    res.json({
      success: true,
      message: 'Session deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete session error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /sessions/logout-all - Logout all sessions for user
 */
router.post('/logout-all', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    // Get all sessions for user
    const sessions = await pb.collection('user_sessions').getFullList({
      filter: `user_id = "${userId}"`,
    });

    // Delete all sessions
    for (const session of sessions) {
      await pb.collection('user_sessions').delete(session.id);
    }

    logger.info(`All sessions deleted for user ${userId}`);

    res.json({
      success: true,
      message: `${sessions.length} session(s) deleted successfully`,
    });
  } catch (error) {
    logger.error(`Logout all error: ${error.message}`);
    throw error;
  }
});

export default router;
