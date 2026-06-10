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
 * GET /reports - List user's reports
 */
router.get('/', requireAuth, async (req, res) => {
  const { userId } = req;
  const { type } = req.query;

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 20;

    let filter = `user_id = "${userId}"`;
    if (type) filter += ` && type = "${type}"`;

    const reports = await pb.collection('reports').getList(page, perPage, {
      filter,
      sort: '-created',
    });

    logger.info(`Retrieved ${reports.items.length} reports for user ${userId}`);

    res.json({
      items: reports.items,
      page: reports.page,
      perPage: reports.perPage,
      totalItems: reports.totalItems,
      totalPages: reports.totalPages,
    });
  } catch (error) {
    logger.error(`Get reports error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /reports - Create new report
 */
router.post('/', requireAuth, async (req, res) => {
  const { userId } = req;
  const { name, type, data_config, visualization_config, schedule_config } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Report name is required' });
  }

  if (!type) {
    return res.status(400).json({ error: 'Report type is required' });
  }

  try {
    const report = await pb.collection('reports').create({
      user_id: userId,
      name: name.trim(),
      type,
      data_config: data_config ? JSON.stringify(data_config) : '{}',
      visualization_config: visualization_config ? JSON.stringify(visualization_config) : '{}',
      schedule_config: schedule_config ? JSON.stringify(schedule_config) : '{}',
      created_at: new Date().toISOString(),
    });

    logger.info(`Report created: id=${report.id}, user_id=${userId}`);

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    logger.error(`Create report error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /reports/:reportId - Get report details
 */
router.get('/:reportId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { reportId } = req.params;

  if (!reportId) {
    return res.status(400).json({ error: 'Report ID is required' });
  }

  try {
    const report = await pb.collection('reports').getOne(reportId);
    if (!report || report.user_id !== userId) {
      return res.status(404).json({ error: 'Report not found or access denied' });
    }

    logger.info(`Retrieved report ${reportId}`);

    res.json({
      ...report,
      data_config: report.data_config ? JSON.parse(report.data_config) : {},
      visualization_config: report.visualization_config ? JSON.parse(report.visualization_config) : {},
      schedule_config: report.schedule_config ? JSON.parse(report.schedule_config) : {},
    });
  } catch (error) {
    logger.error(`Get report error: ${error.message}`);
    throw error;
  }
});

/**
 * PUT /reports/:reportId - Update report
 */
router.put('/:reportId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { reportId } = req.params;
  const { name, type, data_config, visualization_config, schedule_config } = req.body;

  if (!reportId) {
    return res.status(400).json({ error: 'Report ID is required' });
  }

  try {
    const report = await pb.collection('reports').getOne(reportId);
    if (!report || report.user_id !== userId) {
      return res.status(404).json({ error: 'Report not found or access denied' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (type !== undefined) updateData.type = type;
    if (data_config !== undefined) updateData.data_config = JSON.stringify(data_config);
    if (visualization_config !== undefined) updateData.visualization_config = JSON.stringify(visualization_config);
    if (schedule_config !== undefined) updateData.schedule_config = JSON.stringify(schedule_config);
    updateData.updated_at = new Date().toISOString();

    const updatedReport = await pb.collection('reports').update(reportId, updateData);

    logger.info(`Report updated: id=${reportId}`);

    res.json({
      success: true,
      report: updatedReport,
    });
  } catch (error) {
    logger.error(`Update report error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /reports/:reportId - Delete report
 */
router.delete('/:reportId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { reportId } = req.params;

  if (!reportId) {
    return res.status(400).json({ error: 'Report ID is required' });
  }

  try {
    const report = await pb.collection('reports').getOne(reportId);
    if (!report || report.user_id !== userId) {
      return res.status(404).json({ error: 'Report not found or access denied' });
    }

    await pb.collection('reports').delete(reportId);

    logger.info(`Report deleted: id=${reportId}`);

    res.json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete report error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /reports/:reportId/generate - Generate report
 */
router.post('/:reportId/generate', requireAuth, async (req, res) => {
  const { userId } = req;
  const { reportId } = req.params;

  if (!reportId) {
    return res.status(400).json({ error: 'Report ID is required' });
  }

  try {
    const report = await pb.collection('reports').getOne(reportId);
    if (!report || report.user_id !== userId) {
      return res.status(404).json({ error: 'Report not found or access denied' });
    }

    const generatedData = {
      summary: 'Report generated successfully',
      metrics: {},
      charts: [],
    };

    // Create execution record
    const execution = await pb.collection('report_executions').create({
      report_id: reportId,
      user_id: userId,
      generated_data: JSON.stringify(generatedData),
      file_path: `/reports/${reportId}/${Date.now()}.pdf`,
      generated_at: new Date().toISOString(),
    });

    logger.info(`Report generated: report_id=${reportId}, execution_id=${execution.id}`);

    res.json({
      success: true,
      execution_id: execution.id,
      generated_data: generatedData,
      file_path: execution.file_path,
    });
  } catch (error) {
    logger.error(`Generate report error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /reports/:reportId/executions - Get report execution history
 */
router.get('/:reportId/executions', requireAuth, async (req, res) => {
  const { userId } = req;
  const { reportId } = req.params;

  if (!reportId) {
    return res.status(400).json({ error: 'Report ID is required' });
  }

  try {
    const report = await pb.collection('reports').getOne(reportId);
    if (!report || report.user_id !== userId) {
      return res.status(404).json({ error: 'Report not found or access denied' });
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = 20;

    const executions = await pb.collection('report_executions').getList(page, perPage, {
      filter: `report_id = "${reportId}"`,
      sort: '-generated_at',
    });

    logger.info(`Retrieved execution history for report ${reportId}`);

    res.json({
      items: executions.items,
      page: executions.page,
      perPage: executions.perPage,
      totalItems: executions.totalItems,
      totalPages: executions.totalPages,
    });
  } catch (error) {
    logger.error(`Get report executions error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /reports/:reportId/schedule - Schedule report
 */
router.post('/:reportId/schedule', requireAuth, async (req, res) => {
  const { userId } = req;
  const { reportId } = req.params;
  const { frequency, time, email_recipients, format } = req.body;

  if (!reportId) {
    return res.status(400).json({ error: 'Report ID is required' });
  }

  if (!frequency) {
    return res.status(400).json({ error: 'Schedule frequency is required' });
  }

  try {
    const report = await pb.collection('reports').getOne(reportId);
    if (!report || report.user_id !== userId) {
      return res.status(404).json({ error: 'Report not found or access denied' });
    }

    const scheduleConfig = {
      frequency,
      time: time || '09:00',
      email_recipients: email_recipients || [],
      format: format || 'pdf',
    };

    const updatedReport = await pb.collection('reports').update(reportId, {
      schedule_config: JSON.stringify(scheduleConfig),
      scheduled_at: new Date().toISOString(),
    });

    logger.info(`Report scheduled: report_id=${reportId}, frequency=${frequency}`);

    res.json({
      success: true,
      report: updatedReport,
    });
  } catch (error) {
    logger.error(`Schedule report error: ${error.message}`);
    throw error;
  }
});

export default router;