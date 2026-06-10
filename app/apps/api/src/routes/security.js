import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /security/login-history - Get login history for user
 */
router.get('/login-history', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const loginHistory = await pb.collection('login_history').getList(page, perPage, {
      filter: `user_id = "${userId}"`,
      sort: '-login_date',
    });

    logger.info(`Retrieved login history for user ${userId}`);

    res.json({
      items: loginHistory.items,
      page: loginHistory.page,
      perPage: loginHistory.perPage,
      totalItems: loginHistory.totalItems,
      totalPages: loginHistory.totalPages,
    });
  } catch (error) {
    logger.error(`Get login history error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /security/trusted-devices - Get trusted devices for user
 */
router.get('/trusted-devices', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const trustedDevices = await pb.collection('trusted_devices').getList(page, perPage, {
      filter: `user_id = "${userId}"`,
      sort: '-last_used',
    });

    logger.info(`Retrieved trusted devices for user ${userId}`);

    res.json({
      items: trustedDevices.items,
      page: trustedDevices.page,
      perPage: trustedDevices.perPage,
      totalItems: trustedDevices.totalItems,
      totalPages: trustedDevices.totalPages,
    });
  } catch (error) {
    logger.error(`Get trusted devices error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /security/trusted-devices/:deviceId - Delete trusted device
 */
router.delete('/trusted-devices/:deviceId', async (req, res) => {
  const { deviceId } = req.params;
  const { userId } = req.query;

  if (!deviceId || !userId) {
    return res.status(400).json({ error: 'deviceId and userId are required' });
  }

  try {
    // Check if device exists and belongs to user
    const device = await pb.collection('trusted_devices').getOne(deviceId);
    if (!device || device.user_id !== userId) {
      return res.status(404).json({ error: 'Device not found or access denied' });
    }

    await pb.collection('trusted_devices').delete(deviceId);

    logger.info(`Trusted device deleted: device_id=${deviceId}`);

    res.json({
      success: true,
      message: 'Device removed from trusted devices',
    });
  } catch (error) {
    logger.error(`Delete trusted device error: ${error.message}`);
    throw error;
  }
});

export default router;
