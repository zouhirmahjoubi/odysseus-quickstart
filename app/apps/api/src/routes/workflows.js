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
 * GET /workflows - List user's workflows
 */
router.get('/', requireAuth, async (req, res) => {
  const { userId } = req;
  const { q, status, trigger_type } = req.query;

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 20;

    let filter = `user_id = "${userId}"`;
    if (status) filter += ` && status = "${status}"`;
    if (trigger_type) filter += ` && trigger_type = "${trigger_type}"`;
    if (q) filter += ` && (name ~ "${q}" || description ~ "${q}")`;

    const workflows = await pb.collection('workflows').getList(page, perPage, {
      filter,
      sort: '-created',
    });

    logger.info(`Retrieved ${workflows.items.length} workflows for user ${userId}`);

    res.json({
      items: workflows.items,
      page: workflows.page,
      perPage: workflows.perPage,
      totalItems: workflows.totalItems,
      totalPages: workflows.totalPages,
    });
  } catch (error) {
    logger.error(`Get workflows error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /workflows - Create new workflow
 */
router.post('/', requireAuth, async (req, res) => {
  const { userId } = req;
  const { name, description, trigger_type, trigger_config, steps, status = 'draft' } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Workflow name is required' });
  }

  if (!trigger_type) {
    return res.status(400).json({ error: 'Trigger type is required' });
  }

  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    return res.status(400).json({ error: 'At least one workflow step is required' });
  }

  try {
    const workflow = await pb.collection('workflows').create({
      user_id: userId,
      name: name.trim(),
      description: description ? description.trim() : '',
      trigger_type,
      trigger_config: trigger_config ? JSON.stringify(trigger_config) : '{}',
      steps: JSON.stringify(steps),
      status,
      created_at: new Date().toISOString(),
    });

    logger.info(`Workflow created: id=${workflow.id}, user_id=${userId}`);

    res.json({
      success: true,
      workflow,
    });
  } catch (error) {
    logger.error(`Create workflow error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /workflows/:workflowId - Get workflow details
 */
router.get('/:workflowId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { workflowId } = req.params;

  if (!workflowId) {
    return res.status(400).json({ error: 'Workflow ID is required' });
  }

  try {
    const workflow = await pb.collection('workflows').getOne(workflowId);
    if (!workflow || workflow.user_id !== userId) {
      return res.status(404).json({ error: 'Workflow not found or access denied' });
    }

    logger.info(`Retrieved workflow ${workflowId}`);

    res.json({
      ...workflow,
      trigger_config: workflow.trigger_config ? JSON.parse(workflow.trigger_config) : {},
      steps: workflow.steps ? JSON.parse(workflow.steps) : [],
    });
  } catch (error) {
    logger.error(`Get workflow error: ${error.message}`);
    throw error;
  }
});

/**
 * PUT /workflows/:workflowId - Update workflow
 */
router.put('/:workflowId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { workflowId } = req.params;
  const { name, description, trigger_type, trigger_config, steps, status } = req.body;

  if (!workflowId) {
    return res.status(400).json({ error: 'Workflow ID is required' });
  }

  try {
    const workflow = await pb.collection('workflows').getOne(workflowId);
    if (!workflow || workflow.user_id !== userId) {
      return res.status(404).json({ error: 'Workflow not found or access denied' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (trigger_type !== undefined) updateData.trigger_type = trigger_type;
    if (trigger_config !== undefined) updateData.trigger_config = JSON.stringify(trigger_config);
    if (steps !== undefined) updateData.steps = JSON.stringify(steps);
    if (status !== undefined) updateData.status = status;
    updateData.updated_at = new Date().toISOString();

    const updatedWorkflow = await pb.collection('workflows').update(workflowId, updateData);

    logger.info(`Workflow updated: id=${workflowId}`);

    res.json({
      success: true,
      workflow: updatedWorkflow,
    });
  } catch (error) {
    logger.error(`Update workflow error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /workflows/:workflowId - Delete workflow
 */
router.delete('/:workflowId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { workflowId } = req.params;

  if (!workflowId) {
    return res.status(400).json({ error: 'Workflow ID is required' });
  }

  try {
    const workflow = await pb.collection('workflows').getOne(workflowId);
    if (!workflow || workflow.user_id !== userId) {
      return res.status(404).json({ error: 'Workflow not found or access denied' });
    }

    await pb.collection('workflows').delete(workflowId);

    logger.info(`Workflow deleted: id=${workflowId}`);

    res.json({
      success: true,
      message: 'Workflow deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete workflow error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /workflows/:workflowId/run - Execute workflow
 */
router.post('/:workflowId/run', requireAuth, async (req, res) => {
  const { userId } = req;
  const { workflowId } = req.params;
  const { input_data = {} } = req.body;

  if (!workflowId) {
    return res.status(400).json({ error: 'Workflow ID is required' });
  }

  try {
    const workflow = await pb.collection('workflows').getOne(workflowId);
    if (!workflow || workflow.user_id !== userId) {
      return res.status(404).json({ error: 'Workflow not found or access denied' });
    }

    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    // Create execution record
    const execution = await pb.collection('workflow_executions').create({
      workflow_id: workflowId,
      user_id: userId,
      execution_id: executionId,
      status: 'running',
      input_data: JSON.stringify(input_data),
      output_data: '{}',
      logs: JSON.stringify([]),
      started_at: new Date().toISOString(),
    });

    // Simulate workflow execution
    const logs = [];
    let status = 'success';
    let outputData = { ...input_data };

    try {
      const steps = JSON.parse(workflow.steps || '[]');
      for (const step of steps) {
        logs.push({
          timestamp: new Date().toISOString(),
          step: step.name,
          status: 'completed',
          message: `Step "${step.name}" executed successfully`,
        });
      }
    } catch (error) {
      status = 'failed';
      logs.push({
        timestamp: new Date().toISOString(),
        status: 'error',
        message: error.message,
      });
    }

    const executionTime = Date.now() - startTime;

    // Update execution record
    await pb.collection('workflow_executions').update(execution.id, {
      status,
      output_data: JSON.stringify(outputData),
      logs: JSON.stringify(logs),
      execution_time: executionTime,
      completed_at: new Date().toISOString(),
    });

    logger.info(`Workflow executed: workflow_id=${workflowId}, execution_id=${executionId}, status=${status}`);

    res.json({
      success: true,
      execution_id: executionId,
      status,
      execution_time: executionTime,
    });
  } catch (error) {
    logger.error(`Run workflow error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /workflows/:workflowId/logs - List workflow executions
 */
router.get('/:workflowId/logs', requireAuth, async (req, res) => {
  const { userId } = req;
  const { workflowId } = req.params;

  if (!workflowId) {
    return res.status(400).json({ error: 'Workflow ID is required' });
  }

  try {
    const workflow = await pb.collection('workflows').getOne(workflowId);
    if (!workflow || workflow.user_id !== userId) {
      return res.status(404).json({ error: 'Workflow not found or access denied' });
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = 20;

    const executions = await pb.collection('workflow_executions').getList(page, perPage, {
      filter: `workflow_id = "${workflowId}"`,
      sort: '-started_at',
    });

    logger.info(`Retrieved execution logs for workflow ${workflowId}`);

    res.json({
      items: executions.items,
      page: executions.page,
      perPage: executions.perPage,
      totalItems: executions.totalItems,
      totalPages: executions.totalPages,
    });
  } catch (error) {
    logger.error(`Get workflow logs error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /workflows/:workflowId/logs/:executionId - Get execution details
 */
router.get('/:workflowId/logs/:executionId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { workflowId, executionId } = req.params;

  if (!workflowId || !executionId) {
    return res.status(400).json({ error: 'Workflow ID and execution ID are required' });
  }

  try {
    const workflow = await pb.collection('workflows').getOne(workflowId);
    if (!workflow || workflow.user_id !== userId) {
      return res.status(404).json({ error: 'Workflow not found or access denied' });
    }

    const execution = await pb.collection('workflow_executions').getFirstListItem(
      `workflow_id = "${workflowId}" && execution_id = "${executionId}"`
    );

    if (!execution) {
      return res.status(404).json({ error: 'Execution not found' });
    }

    logger.info(`Retrieved execution details: execution_id=${executionId}`);

    res.json({
      ...execution,
      input_data: execution.input_data ? JSON.parse(execution.input_data) : {},
      output_data: execution.output_data ? JSON.parse(execution.output_data) : {},
      logs: execution.logs ? JSON.parse(execution.logs) : [],
    });
  } catch (error) {
    logger.error(`Get execution details error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /workflows/:workflowId/logs/:executionId/retry - Retry failed execution
 */
router.post('/:workflowId/logs/:executionId/retry', requireAuth, async (req, res) => {
  const { userId } = req;
  const { workflowId, executionId } = req.params;

  if (!workflowId || !executionId) {
    return res.status(400).json({ error: 'Workflow ID and execution ID are required' });
  }

  try {
    const workflow = await pb.collection('workflows').getOne(workflowId);
    if (!workflow || workflow.user_id !== userId) {
      return res.status(404).json({ error: 'Workflow not found or access denied' });
    }

    const execution = await pb.collection('workflow_executions').getFirstListItem(
      `workflow_id = "${workflowId}" && execution_id = "${executionId}"`
    );

    if (!execution) {
      return res.status(404).json({ error: 'Execution not found' });
    }

    const inputData = execution.input_data ? JSON.parse(execution.input_data) : {};
    const newExecutionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    // Create new execution record
    const newExecution = await pb.collection('workflow_executions').create({
      workflow_id: workflowId,
      user_id: userId,
      execution_id: newExecutionId,
      status: 'running',
      input_data: JSON.stringify(inputData),
      output_data: '{}',
      logs: JSON.stringify([]),
      started_at: new Date().toISOString(),
      retry_of: executionId,
    });

    // Simulate workflow execution
    const logs = [];
    let status = 'success';
    let outputData = { ...inputData };

    try {
      const steps = JSON.parse(workflow.steps || '[]');
      for (const step of steps) {
        logs.push({
          timestamp: new Date().toISOString(),
          step: step.name,
          status: 'completed',
          message: `Step "${step.name}" executed successfully`,
        });
      }
    } catch (error) {
      status = 'failed';
      logs.push({
        timestamp: new Date().toISOString(),
        status: 'error',
        message: error.message,
      });
    }

    const executionTime = Date.now() - startTime;

    // Update execution record
    await pb.collection('workflow_executions').update(newExecution.id, {
      status,
      output_data: JSON.stringify(outputData),
      logs: JSON.stringify(logs),
      execution_time: executionTime,
      completed_at: new Date().toISOString(),
    });

    logger.info(`Workflow retry executed: workflow_id=${workflowId}, new_execution_id=${newExecutionId}`);

    res.json({
      success: true,
      execution_id: newExecutionId,
      status,
      execution_time: executionTime,
    });
  } catch (error) {
    logger.error(`Retry workflow error: ${error.message}`);
    throw error;
  }
});

export default router;