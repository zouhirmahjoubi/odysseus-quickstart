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
 * GET /admin/teams - List all teams
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const teams = await pb.collection('teams').getList(page, perPage, {
      sort: '-created',
    });

    logger.info(`Retrieved ${teams.items.length} teams (admin)`);

    res.json({
      items: teams.items,
      page: teams.page,
      perPage: teams.perPage,
      totalItems: teams.totalItems,
      totalPages: teams.totalPages,
    });
  } catch (error) {
    logger.error(`Admin get teams error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /admin/teams/stats - Get team statistics
 */
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const teams = await pb.collection('teams').getFullList();
    const members = await pb.collection('team_members').getFullList();

    const totalTeams = teams.length;
    const activeTeams = teams.filter((t) => t.active).length;
    const totalMembers = members.length;
    const avgMembersPerTeam = totalTeams > 0 ? Math.round(totalMembers / totalTeams) : 0;

    logger.info('Admin team stats retrieved');

    res.json({
      totalTeams,
      activeTeams,
      totalMembers,
      avgMembersPerTeam,
    });
  } catch (error) {
    logger.error(`Admin team stats error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /admin/teams/:id/members - Get team members
 */
router.get('/:id/members', requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Team ID is required' });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const members = await pb.collection('team_members').getList(page, perPage, {
      filter: `team_id = "${id}"`,
      sort: '-joined_at',
    });

    logger.info(`Retrieved ${members.items.length} members for team ${id} (admin)`);

    res.json({
      items: members.items,
      page: members.page,
      perPage: members.perPage,
      totalItems: members.totalItems,
      totalPages: members.totalPages,
    });
  } catch (error) {
    logger.error(`Admin get team members error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /admin/teams/:id/activity - Get team activity
 */
router.get('/:id/activity', requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Team ID is required' });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const activity = await pb.collection('team_activity').getList(page, perPage, {
      filter: `team_id = "${id}"`,
      sort: '-created',
    });

    logger.info(`Retrieved ${activity.items.length} activity logs for team ${id} (admin)`);

    res.json({
      items: activity.items,
      page: activity.page,
      perPage: activity.perPage,
      totalItems: activity.totalItems,
      totalPages: activity.totalPages,
    });
  } catch (error) {
    logger.error(`Admin get team activity error: ${error.message}`);
    throw error;
  }
});

/**
 * PUT /admin/teams/:id/disable - Disable team
 */
router.put('/:id/disable', requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Team ID is required' });
  }

  try {
    const team = await pb.collection('teams').getOne(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const updatedTeam = await pb.collection('teams').update(id, { active: false });

    logger.info(`Team disabled (admin): id=${id}`);

    res.json({
      success: true,
      team: updatedTeam,
    });
  } catch (error) {
    logger.error(`Admin disable team error: ${error.message}`);
    throw error;
  }
});

/**
 * PUT /admin/teams/:id/enable - Enable team
 */
router.put('/:id/enable', requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Team ID is required' });
  }

  try {
    const team = await pb.collection('teams').getOne(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const updatedTeam = await pb.collection('teams').update(id, { active: true });

    logger.info(`Team enabled (admin): id=${id}`);

    res.json({
      success: true,
      team: updatedTeam,
    });
  } catch (error) {
    logger.error(`Admin enable team error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /admin/teams/:id - Delete team
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Team ID is required' });
  }

  try {
    const team = await pb.collection('teams').getOne(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    await pb.collection('teams').delete(id);

    logger.info(`Team deleted (admin): id=${id}`);

    res.json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    logger.error(`Admin delete team error: ${error.message}`);
    throw error;
  }
});

export default router;
