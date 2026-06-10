import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { generateToken } from '../utils/crypto.js';

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
 * POST /teams - Create new team
 */
router.post('/', requireAuth, async (req, res) => {
  const { userId } = req;
  const { name, description, website, email } = req.body;

  // Validate required fields
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Team name is required' });
  }

  try {
    const team = await pb.collection('teams').create({
      owner_id: userId,
      name: name.trim(),
      description: description ? description.trim() : '',
      website: website ? website.trim() : '',
      email: email ? email.trim() : '',
      active: true,
    });

    // Create team member record for owner
    await pb.collection('team_members').create({
      team_id: team.id,
      user_id: userId,
      role: 'owner',
      permissions: JSON.stringify(['read', 'write', 'delete', 'admin']),
      joined_at: new Date().toISOString(),
    });

    logger.info(`Team created: id=${team.id}, owner_id=${userId}`);

    res.json({
      success: true,
      team: {
        id: team.id,
        name: team.name,
        description: team.description,
        website: team.website,
        email: team.email,
        owner_id: team.owner_id,
        created_date: team.created,
      },
    });
  } catch (error) {
    logger.error(`Create team error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /teams - List user's teams
 */
router.get('/', requireAuth, async (req, res) => {
  const { userId } = req;

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    // Get teams where user is owner or member
    const teams = await pb.collection('teams').getList(page, perPage, {
      filter: `owner_id = "${userId}"`,
      sort: '-created',
    });

    // Also get teams where user is a member
    const memberTeams = await pb.collection('team_members').getFullList({
      filter: `user_id = "${userId}" && role != "owner"`,
    });

    const memberTeamIds = memberTeams.map((m) => m.team_id);

    // Enrich teams with member count
    const items = await Promise.all(
      teams.items.map(async (team) => {
        const members = await pb.collection('team_members').getList(1, 1, {
          filter: `team_id = "${team.id}"`,
        });
        return {
          id: team.id,
          name: team.name,
          description: team.description,
          owner_id: team.owner_id,
          member_count: members.totalItems,
          created_date: team.created,
        };
      })
    );

    logger.info(`Retrieved ${teams.items.length} teams for user ${userId}`);

    res.json({
      items,
      page: teams.page,
      perPage: teams.perPage,
      totalItems: teams.totalItems,
      totalPages: teams.totalPages,
    });
  } catch (error) {
    logger.error(`Get teams error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /teams/:teamId - Get team details
 */
router.get('/:teamId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { teamId } = req.params;

  if (!teamId) {
    return res.status(400).json({ error: 'Team ID is required' });
  }

  try {
    const team = await pb.collection('teams').getOne(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is owner or member
    const memberRecord = await pb.collection('team_members').getFirstListItem(`team_id = "${teamId}" && user_id = "${userId}"`);
    if (!memberRecord && team.owner_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get member count
    const members = await pb.collection('team_members').getList(1, 1, {
      filter: `team_id = "${teamId}"`,
    });

    logger.info(`Retrieved team ${teamId}`);

    res.json({
      id: team.id,
      name: team.name,
      description: team.description,
      website: team.website,
      email: team.email,
      owner_id: team.owner_id,
      member_count: members.totalItems,
      active: team.active,
      created_date: team.created,
    });
  } catch (error) {
    logger.error(`Get team error: ${error.message}`);
    throw error;
  }
});

/**
 * PUT /teams/:teamId - Update team
 */
router.put('/:teamId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { teamId } = req.params;
  const { name, description, logo, website, email } = req.body;

  if (!teamId) {
    return res.status(400).json({ error: 'Team ID is required' });
  }

  try {
    const team = await pb.collection('teams').getOne(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is owner
    if (team.owner_id !== userId) {
      return res.status(403).json({ error: 'Only team owner can update team' });
    }

    // Build update data
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (logo !== undefined) updateData.logo = logo;
    if (website !== undefined) updateData.website = website.trim();
    if (email !== undefined) updateData.email = email.trim();

    const updatedTeam = await pb.collection('teams').update(teamId, updateData);

    logger.info(`Team updated: id=${teamId}`);

    res.json({
      success: true,
      team: updatedTeam,
    });
  } catch (error) {
    logger.error(`Update team error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /teams/:teamId - Delete team
 */
router.delete('/:teamId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { teamId } = req.params;

  if (!teamId) {
    return res.status(400).json({ error: 'Team ID is required' });
  }

  try {
    const team = await pb.collection('teams').getOne(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is owner
    if (team.owner_id !== userId) {
      return res.status(403).json({ error: 'Only team owner can delete team' });
    }

    // Delete all team members
    const members = await pb.collection('team_members').getFullList({
      filter: `team_id = "${teamId}"`,
    });
    for (const member of members) {
      await pb.collection('team_members').delete(member.id);
    }

    // Delete all team invitations
    const invitations = await pb.collection('team_invitations').getFullList({
      filter: `team_id = "${teamId}"`,
    });
    for (const invitation of invitations) {
      await pb.collection('team_invitations').delete(invitation.id);
    }

    // Delete team
    await pb.collection('teams').delete(teamId);

    logger.info(`Team deleted: id=${teamId}`);

    res.json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete team error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /teams/:teamId/members - Invite team member
 */
router.post('/:teamId/members', requireAuth, async (req, res) => {
  const { userId } = req;
  const { teamId } = req.params;
  const { email, role = 'member', permissions = [] } = req.body;

  if (!teamId || !email) {
    return res.status(400).json({ error: 'Team ID and email are required' });
  }

  if (!['member', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Role must be "member" or "admin"' });
  }

  try {
    const team = await pb.collection('teams').getOne(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is owner
    if (team.owner_id !== userId) {
      return res.status(403).json({ error: 'Only team owner can invite members' });
    }

    // Check if invitation already exists
    try {
      const existingInvite = await pb.collection('team_invitations').getFirstListItem(
        `team_id = "${teamId}" && email = "${email}" && status = "pending"`
      );
      return res.status(400).json({ error: 'Invitation already sent to this email' });
    } catch (error) {
      // Invitation doesn't exist, continue
    }

    const inviteToken = generateToken(32);

    const invitation = await pb.collection('team_invitations').create({
      team_id: teamId,
      email: email.trim(),
      role,
      permissions: JSON.stringify(permissions),
      token: inviteToken,
      status: 'pending',
      sent_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    logger.info(`Team invitation sent: team_id=${teamId}, email=${email}`);

    res.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        sent_at: invitation.sent_at,
        expires_at: invitation.expires_at,
      },
    });
  } catch (error) {
    logger.error(`Invite team member error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /teams/:teamId/members - List team members
 */
router.get('/:teamId/members', requireAuth, async (req, res) => {
  const { userId } = req;
  const { teamId } = req.params;

  if (!teamId) {
    return res.status(400).json({ error: 'Team ID is required' });
  }

  try {
    const team = await pb.collection('teams').getOne(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is owner or member
    const memberRecord = await pb.collection('team_members').getFirstListItem(`team_id = "${teamId}" && user_id = "${userId}"`);
    if (!memberRecord && team.owner_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const members = await pb.collection('team_members').getList(page, perPage, {
      filter: `team_id = "${teamId}"`,
      sort: '-joined_at',
    });

    // Enrich with user info
    const items = await Promise.all(
      members.items.map(async (member) => {
        try {
          const user = await pb.collection('users').getOne(member.user_id);
          return {
            user_id: member.user_id,
            email: user.email,
            role: member.role,
            permissions: member.permissions ? JSON.parse(member.permissions) : [],
            joined_date: member.joined_at,
            status: 'active',
          };
        } catch (error) {
          return {
            user_id: member.user_id,
            email: 'Unknown',
            role: member.role,
            permissions: member.permissions ? JSON.parse(member.permissions) : [],
            joined_date: member.joined_at,
            status: 'active',
          };
        }
      })
    );

    logger.info(`Retrieved ${members.items.length} members for team ${teamId}`);

    res.json({
      items,
      page: members.page,
      perPage: members.perPage,
      totalItems: members.totalItems,
      totalPages: members.totalPages,
    });
  } catch (error) {
    logger.error(`Get team members error: ${error.message}`);
    throw error;
  }
});

/**
 * PUT /teams/:teamId/members/:memberId - Update team member role/permissions
 */
router.put('/:teamId/members/:memberId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { teamId, memberId } = req.params;
  const { role, permissions } = req.body;

  if (!teamId || !memberId) {
    return res.status(400).json({ error: 'Team ID and member ID are required' });
  }

  if (role && !['member', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Role must be "member" or "admin"' });
  }

  try {
    const team = await pb.collection('teams').getOne(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is owner
    if (team.owner_id !== userId) {
      return res.status(403).json({ error: 'Only team owner can update member roles' });
    }

    const memberRecord = await pb.collection('team_members').getFirstListItem(
      `team_id = "${teamId}" && user_id = "${memberId}"`
    );
    if (!memberRecord) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    const updateData = {};
    if (role !== undefined) updateData.role = role;
    if (permissions !== undefined) updateData.permissions = JSON.stringify(permissions);

    const updatedMember = await pb.collection('team_members').update(memberRecord.id, updateData);

    logger.info(`Team member updated: team_id=${teamId}, user_id=${memberId}`);

    res.json({
      success: true,
      member: updatedMember,
    });
  } catch (error) {
    logger.error(`Update team member error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /teams/:teamId/members/:memberId - Remove team member
 */
router.delete('/:teamId/members/:memberId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { teamId, memberId } = req.params;

  if (!teamId || !memberId) {
    return res.status(400).json({ error: 'Team ID and member ID are required' });
  }

  try {
    const team = await pb.collection('teams').getOne(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is owner or removing themselves
    if (team.owner_id !== userId && userId !== memberId) {
      return res.status(403).json({ error: 'Only team owner can remove members' });
    }

    const memberRecord = await pb.collection('team_members').getFirstListItem(
      `team_id = "${teamId}" && user_id = "${memberId}"`
    );
    if (!memberRecord) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    await pb.collection('team_members').delete(memberRecord.id);

    logger.info(`Member removed from team: team_id=${teamId}, user_id=${memberId}`);

    res.json({
      success: true,
      message: 'Member removed from team',
    });
  } catch (error) {
    logger.error(`Remove team member error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /teams/:teamId/invitations - List pending invitations
 */
router.get('/:teamId/invitations', requireAuth, async (req, res) => {
  const { userId } = req;
  const { teamId } = req.params;

  if (!teamId) {
    return res.status(400).json({ error: 'Team ID is required' });
  }

  try {
    const team = await pb.collection('teams').getOne(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is owner
    if (team.owner_id !== userId) {
      return res.status(403).json({ error: 'Only team owner can view invitations' });
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const invitations = await pb.collection('team_invitations').getList(page, perPage, {
      filter: `team_id = "${teamId}"`,
      sort: '-sent_at',
    });

    logger.info(`Retrieved ${invitations.items.length} invitations for team ${teamId}`);

    res.json({
      items: invitations.items,
      page: invitations.page,
      perPage: invitations.perPage,
      totalItems: invitations.totalItems,
      totalPages: invitations.totalPages,
    });
  } catch (error) {
    logger.error(`Get team invitations error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /teams/:teamId/invitations/:invitationId/accept - Accept invitation
 */
router.post('/:teamId/invitations/:invitationId/accept', requireAuth, async (req, res) => {
  const { userId } = req;
  const { teamId, invitationId } = req.params;

  if (!teamId || !invitationId) {
    return res.status(400).json({ error: 'Team ID and invitation ID are required' });
  }

  try {
    const team = await pb.collection('teams').getOne(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const invitation = await pb.collection('team_invitations').getOne(invitationId);
    if (!invitation || invitation.team_id !== teamId) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ error: 'Invitation is no longer valid' });
    }

    // Add user to team
    const teamMember = await pb.collection('team_members').create({
      team_id: teamId,
      user_id: userId,
      role: invitation.role,
      permissions: invitation.permissions,
      joined_at: new Date().toISOString(),
    });

    // Update invitation status
    await pb.collection('team_invitations').update(invitationId, {
      status: 'accepted',
      accepted_at: new Date().toISOString(),
    });

    logger.info(`Team invitation accepted: team_id=${teamId}, user_id=${userId}`);

    res.json({
      success: true,
      message: 'Invitation accepted successfully',
      member: teamMember,
    });
  } catch (error) {
    logger.error(`Accept team invitation error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /teams/:teamId/invitations/:invitationId/decline - Decline invitation
 */
router.post('/:teamId/invitations/:invitationId/decline', requireAuth, async (req, res) => {
  const { userId } = req;
  const { teamId, invitationId } = req.params;

  if (!teamId || !invitationId) {
    return res.status(400).json({ error: 'Team ID and invitation ID are required' });
  }

  try {
    const team = await pb.collection('teams').getOne(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const invitation = await pb.collection('team_invitations').getOne(invitationId);
    if (!invitation || invitation.team_id !== teamId) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ error: 'Invitation is no longer valid' });
    }

    // Delete invitation
    await pb.collection('team_invitations').delete(invitationId);

    logger.info(`Team invitation declined: team_id=${teamId}, user_id=${userId}`);

    res.json({
      success: true,
      message: 'Invitation declined',
    });
  } catch (error) {
    logger.error(`Decline team invitation error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /teams/:teamId/agents - List team agents
 */
router.get('/:teamId/agents', requireAuth, async (req, res) => {
  const { userId } = req;
  const { teamId } = req.params;

  if (!teamId) {
    return res.status(400).json({ error: 'Team ID is required' });
  }

  try {
    const team = await pb.collection('teams').getOne(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is owner or member
    const memberRecord = await pb.collection('team_members').getFirstListItem(`team_id = "${teamId}" && user_id = "${userId}"`);
    if (!memberRecord && team.owner_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const agents = await pb.collection('team_agents').getList(page, perPage, {
      filter: `team_id = "${teamId}"`,
      sort: '-created',
    });

    logger.info(`Retrieved ${agents.items.length} agents for team ${teamId}`);

    res.json({
      items: agents.items,
      page: agents.page,
      perPage: agents.perPage,
      totalItems: agents.totalItems,
      totalPages: agents.totalPages,
    });
  } catch (error) {
    logger.error(`Get team agents error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /teams/:teamId/agents/:agentId/share - Share agent with team
 */
router.post('/:teamId/agents/:agentId/share', requireAuth, async (req, res) => {
  const { userId } = req;
  const { teamId, agentId } = req.params;
  const { shared_with = [], permissions = [] } = req.body;

  if (!teamId || !agentId) {
    return res.status(400).json({ error: 'Team ID and agent ID are required' });
  }

  try {
    const team = await pb.collection('teams').getOne(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is owner
    if (team.owner_id !== userId) {
      return res.status(403).json({ error: 'Only team owner can share agents' });
    }

    // Check if agent exists
    const agent = await pb.collection('market_agents').getOne(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Create or update team_agents record
    let teamAgent;
    try {
      const existing = await pb.collection('team_agents').getFirstListItem(`team_id = "${teamId}" && agent_id = "${agentId}"`);
      teamAgent = await pb.collection('team_agents').update(existing.id, {
        shared_with: JSON.stringify(shared_with),
        permissions: JSON.stringify(permissions),
      });
    } catch (error) {
      teamAgent = await pb.collection('team_agents').create({
        team_id: teamId,
        agent_id: agentId,
        shared_with: JSON.stringify(shared_with),
        permissions: JSON.stringify(permissions),
      });
    }

    logger.info(`Agent shared with team: team_id=${teamId}, agent_id=${agentId}`);

    res.json({
      success: true,
      teamAgent,
    });
  } catch (error) {
    logger.error(`Share agent error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /teams/:teamId/agents/:agentId/share - Unshare agent
 */
router.delete('/:teamId/agents/:agentId/share', requireAuth, async (req, res) => {
  const { userId } = req;
  const { teamId, agentId } = req.params;

  if (!teamId || !agentId) {
    return res.status(400).json({ error: 'Team ID and agent ID are required' });
  }

  try {
    const team = await pb.collection('teams').getOne(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is owner
    if (team.owner_id !== userId) {
      return res.status(403).json({ error: 'Only team owner can unshare agents' });
    }

    const teamAgent = await pb.collection('team_agents').getFirstListItem(`team_id = "${teamId}" && agent_id = "${agentId}"`);
    if (!teamAgent) {
      return res.status(404).json({ error: 'Agent not shared with this team' });
    }

    await pb.collection('team_agents').delete(teamAgent.id);

    logger.info(`Agent unshared from team: team_id=${teamId}, agent_id=${agentId}`);

    res.json({
      success: true,
      message: 'Agent unshared from team',
    });
  } catch (error) {
    logger.error(`Unshare agent error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /teams/:teamId/activity - Get team activity log
 */
router.get('/:teamId/activity', requireAuth, async (req, res) => {
  const { userId } = req;
  const { teamId } = req.params;
  const { activity_type, user_id: filterUserId } = req.query;

  if (!teamId) {
    return res.status(400).json({ error: 'Team ID is required' });
  }

  try {
    const team = await pb.collection('teams').getOne(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is owner or member
    const memberRecord = await pb.collection('team_members').getFirstListItem(`team_id = "${teamId}" && user_id = "${userId}"`);
    if (!memberRecord && team.owner_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    let filter = `team_id = "${teamId}"`;
    if (activity_type) filter += ` && activity_type = "${activity_type}"`;
    if (filterUserId) filter += ` && user_id = "${filterUserId}"`;

    const activity = await pb.collection('team_activity').getList(page, perPage, {
      filter,
      sort: '-created',
    });

    logger.info(`Retrieved ${activity.items.length} activity logs for team ${teamId}`);

    res.json({
      items: activity.items,
      page: activity.page,
      perPage: activity.perPage,
      totalItems: activity.totalItems,
      totalPages: activity.totalPages,
    });
  } catch (error) {
    logger.error(`Get team activity error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /teams/:teamId/analytics - Get team analytics
 */
router.get('/:teamId/analytics', requireAuth, async (req, res) => {
  const { userId } = req;
  const { teamId } = req.params;

  if (!teamId) {
    return res.status(400).json({ error: 'Team ID is required' });
  }

  try {
    const team = await pb.collection('teams').getOne(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is owner or member
    const memberRecord = await pb.collection('team_members').getFirstListItem(`team_id = "${teamId}" && user_id = "${userId}"`);
    if (!memberRecord && team.owner_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get team members
    const members = await pb.collection('team_members').getFullList({
      filter: `team_id = "${teamId}"`,
    });

    const memberIds = members.map((m) => m.user_id);

    // Get team agents
    const agents = await pb.collection('team_agents').getFullList({
      filter: `team_id = "${teamId}"`,
    });

    const agentIds = agents.map((a) => a.agent_id);

    // Aggregate analytics for all team members and agents
    let totalApiCalls = 0;
    let totalTestRuns = 0;
    let totalAgentInstallations = 0;
    let totalRevenue = 0;

    // Get quota history for team members
    for (const memberId of memberIds) {
      const quotaHistory = await pb.collection('quota_history').getFullList({
        filter: `user_id = "${memberId}"`,
      });
      totalApiCalls += quotaHistory.filter((q) => q.quota_type === 'api_calls').length;
      totalTestRuns += quotaHistory.filter((q) => q.quota_type === 'test_runs').length;
      totalAgentInstallations += quotaHistory.filter((q) => q.quota_type === 'agent_installations').length;
    }

    // Get orders for team
    const orders = await pb.collection('orders').getFullList({
      filter: `status = "completed"`,
    });
    totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    logger.info(`Retrieved analytics for team ${teamId}`);

    res.json({
      teamId,
      memberCount: members.length,
      agentCount: agents.length,
      summary: {
        totalApiCalls,
        totalTestRuns,
        totalAgentInstallations,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
      },
    });
  } catch (error) {
    logger.error(`Get team analytics error: ${error.message}`);
    throw error;
  }
});

export default router;
