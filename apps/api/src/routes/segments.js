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
 * POST /segments - Create user segment
 */
router.post('/', requireAuth, async (req, res) => {
  const { userId } = req;
  const { name, description, criteria } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Segment name is required' });
  }

  if (!criteria || !Array.isArray(criteria) || criteria.length === 0) {
    return res.status(400).json({ error: 'At least one criteria is required' });
  }

  // Validate criteria structure
  for (const criterion of criteria) {
    if (!criterion.field || !criterion.operator || criterion.value === undefined) {
      return res.status(400).json({ error: 'Each criteria must have field, operator, and value' });
    }
  }

  try {
    const segment = await pb.collection('segments').create({
      user_id: userId,
      name: name.trim(),
      description: description ? description.trim() : '',
      criteria: JSON.stringify(criteria),
      member_count: 0,
      created_at: new Date().toISOString(),
    });

    logger.info(`Segment created: id=${segment.id}, user_id=${userId}`);

    res.json({
      success: true,
      segment: {
        id: segment.id,
        name: segment.name,
        description: segment.description,
        criteria: criteria,
        member_count: 0,
        created_date: segment.created,
      },
    });
  } catch (error) {
    logger.error(`Create segment error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /segments - List user segments with pagination
 */
router.get('/', requireAuth, async (req, res) => {
  const { userId } = req;
  const { q, type } = req.query;

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    let filter = `user_id = "${userId}"`;
    if (type) filter += ` && type = "${type}"`;
    if (q) filter += ` && name ~ "${q}"`;

    const segments = await pb.collection('segments').getList(page, perPage, {
      filter,
      sort: '-created',
    });

    const items = segments.items.map((segment) => ({
      id: segment.id,
      name: segment.name,
      description: segment.description,
      member_count: segment.member_count || 0,
      created_date: segment.created,
    }));

    logger.info(`Retrieved ${segments.items.length} segments for user ${userId}`);

    res.json({
      items,
      page: segments.page,
      perPage: segments.perPage,
      totalItems: segments.totalItems,
      totalPages: segments.totalPages,
    });
  } catch (error) {
    logger.error(`Get segments error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /segments/:segmentId - Get segment details with members
 */
router.get('/:segmentId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { segmentId } = req.params;

  if (!segmentId) {
    return res.status(400).json({ error: 'Segment ID is required' });
  }

  try {
    const segment = await pb.collection('segments').getOne(segmentId);
    if (!segment || segment.user_id !== userId) {
      return res.status(404).json({ error: 'Segment not found or access denied' });
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    // Get segment members
    const members = await pb.collection('segment_members').getList(page, perPage, {
      filter: `segment_id = "${segmentId}"`,
      sort: '-added_at',
    });

    // Enrich with user details
    const memberItems = await Promise.all(
      members.items.map(async (member) => {
        try {
          const user = await pb.collection('users').getOne(member.user_id);
          return {
            user_id: member.user_id,
            name: user.name,
            email: user.email,
            role: user.role || 'user',
            last_activity: user.updated || null,
          };
        } catch (error) {
          return {
            user_id: member.user_id,
            name: 'Unknown',
            email: 'unknown@example.com',
            role: 'user',
            last_activity: null,
          };
        }
      })
    );

    logger.info(`Retrieved segment ${segmentId} with ${members.items.length} members`);

    res.json({
      id: segment.id,
      name: segment.name,
      description: segment.description,
      criteria: segment.criteria ? JSON.parse(segment.criteria) : [],
      member_count: segment.member_count || 0,
      created_date: segment.created,
      members: {
        items: memberItems,
        page: members.page,
        perPage: members.perPage,
        totalItems: members.totalItems,
        totalPages: members.totalPages,
      },
    });
  } catch (error) {
    logger.error(`Get segment error: ${error.message}`);
    throw error;
  }
});

/**
 * PUT /segments/:segmentId - Update segment
 */
router.put('/:segmentId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { segmentId } = req.params;
  const { name, description, criteria } = req.body;

  if (!segmentId) {
    return res.status(400).json({ error: 'Segment ID is required' });
  }

  // Validate criteria if provided
  if (criteria) {
    if (!Array.isArray(criteria) || criteria.length === 0) {
      return res.status(400).json({ error: 'Criteria must be a non-empty array' });
    }
    for (const criterion of criteria) {
      if (!criterion.field || !criterion.operator || criterion.value === undefined) {
        return res.status(400).json({ error: 'Each criteria must have field, operator, and value' });
      }
    }
  }

  try {
    const segment = await pb.collection('segments').getOne(segmentId);
    if (!segment || segment.user_id !== userId) {
      return res.status(404).json({ error: 'Segment not found or access denied' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (criteria !== undefined) updateData.criteria = JSON.stringify(criteria);
    updateData.updated_at = new Date().toISOString();

    const updatedSegment = await pb.collection('segments').update(segmentId, updateData);

    logger.info(`Segment updated: id=${segmentId}`);

    res.json({
      success: true,
      segment: {
        id: updatedSegment.id,
        name: updatedSegment.name,
        description: updatedSegment.description,
        criteria: updatedSegment.criteria ? JSON.parse(updatedSegment.criteria) : [],
        member_count: updatedSegment.member_count || 0,
      },
    });
  } catch (error) {
    logger.error(`Update segment error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /segments/:segmentId - Delete segment
 */
router.delete('/:segmentId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { segmentId } = req.params;

  if (!segmentId) {
    return res.status(400).json({ error: 'Segment ID is required' });
  }

  try {
    const segment = await pb.collection('segments').getOne(segmentId);
    if (!segment || segment.user_id !== userId) {
      return res.status(404).json({ error: 'Segment not found or access denied' });
    }

    // Delete all segment members
    const members = await pb.collection('segment_members').getFullList({
      filter: `segment_id = "${segmentId}"`,
    });
    for (const member of members) {
      await pb.collection('segment_members').delete(member.id);
    }

    // Delete segment
    await pb.collection('segments').delete(segmentId);

    logger.info(`Segment deleted: id=${segmentId}`);

    res.json({
      success: true,
      message: 'Segment deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete segment error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /segments/:segmentId/send-email - Send email to segment members
 */
router.post('/:segmentId/send-email', requireAuth, async (req, res) => {
  const { userId } = req;
  const { segmentId } = req.params;
  const { subject, message } = req.body;

  if (!segmentId) {
    return res.status(400).json({ error: 'Segment ID is required' });
  }

  if (!subject || !subject.trim()) {
    return res.status(400).json({ error: 'Email subject is required' });
  }

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Email message is required' });
  }

  try {
    const segment = await pb.collection('segments').getOne(segmentId);
    if (!segment || segment.user_id !== userId) {
      return res.status(404).json({ error: 'Segment not found or access denied' });
    }

    // Get all segment members
    const members = await pb.collection('segment_members').getFullList({
      filter: `segment_id = "${segmentId}"`,
    });

    let successCount = 0;
    let failureCount = 0;
    const emailLog = [];

    // Send email to each member
    for (const member of members) {
      try {
        const user = await pb.collection('users').getOne(member.user_id);
        
        // Log email send (in production, integrate with actual email service)
        emailLog.push({
          user_id: member.user_id,
          email: user.email,
          status: 'sent',
          sent_at: new Date().toISOString(),
        });
        successCount++;

        logger.info(`Email sent to ${user.email} from segment ${segmentId}`);
      } catch (error) {
        failureCount++;
        logger.error(`Failed to send email to member ${member.user_id}: ${error.message}`);
      }
    }

    // Create campaign record
    const campaign = await pb.collection('email_campaigns').create({
      user_id: userId,
      segment_id: segmentId,
      subject: subject.trim(),
      message: message.trim(),
      recipient_count: members.length,
      success_count: successCount,
      failure_count: failureCount,
      email_log: JSON.stringify(emailLog),
      sent_at: new Date().toISOString(),
    });

    logger.info(`Email campaign sent: id=${campaign.id}, segment_id=${segmentId}, recipients=${successCount}`);

    res.json({
      success: true,
      campaign_id: campaign.id,
      recipient_count: members.length,
      success_count: successCount,
      failure_count: failureCount,
    });
  } catch (error) {
    logger.error(`Send segment email error: ${error.message}`);
    throw error;
  }
});

export default router;