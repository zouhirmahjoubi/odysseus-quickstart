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
 * POST /mobile/devices - Register new mobile device
 */
router.post('/devices', requireAuth, async (req, res) => {
  const { userId } = req;
  const { device_id, device_type, device_name, os_version, app_version } = req.body;

  if (!device_id || !device_id.trim()) {
    return res.status(400).json({ error: 'Device ID is required' });
  }

  if (!device_type) {
    return res.status(400).json({ error: 'Device type is required' });
  }

  if (!['iOS', 'Android'].includes(device_type)) {
    return res.status(400).json({ error: 'Device type must be iOS or Android' });
  }

  try {
    // Check if device already registered
    let device;
    try {
      const existing = await pb.collection('mobile_devices').getFirstListItem(
        `user_id = "${userId}" && device_id = "${device_id}"`
      );
      device = await pb.collection('mobile_devices').update(existing.id, {
        device_type,
        device_name: device_name || existing.device_name,
        os_version: os_version || existing.os_version,
        app_version: app_version || existing.app_version,
        last_seen: new Date().toISOString(),
      });
    } catch (error) {
      // Register new device
      device = await pb.collection('mobile_devices').create({
        user_id: userId,
        device_id: device_id.trim(),
        device_type,
        device_name: device_name || 'Unknown Device',
        os_version: os_version || '',
        app_version: app_version || '',
        push_token: generateToken(32),
        is_active: true,
        registered_at: new Date().toISOString(),
        last_seen: new Date().toISOString(),
      });
    }

    logger.info(`Mobile device registered: user_id=${userId}, device_id=${device_id}, type=${device_type}`);

    res.json({
      success: true,
      device: {
        id: device.id,
        device_id: device.device_id,
        device_type: device.device_type,
        device_name: device.device_name,
        push_token: device.push_token,
        is_active: device.is_active,
        registered_at: device.registered_at,
      },
    });
  } catch (error) {
    logger.error(`Register device error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /mobile/devices - Get all connected devices for user
 */
router.get('/devices', requireAuth, async (req, res) => {
  const { userId } = req;

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const devices = await pb.collection('mobile_devices').getList(page, perPage, {
      filter: `user_id = "${userId}"`,
      sort: '-last_seen',
    });

    const items = devices.items.map((device) => ({
      id: device.id,
      device_id: device.device_id,
      device_type: device.device_type,
      device_name: device.device_name,
      os_version: device.os_version,
      app_version: device.app_version,
      is_active: device.is_active,
      registered_at: device.registered_at,
      last_seen: device.last_seen,
    }));

    logger.info(`Retrieved ${devices.items.length} devices for user ${userId}`);

    res.json({
      items,
      page: devices.page,
      perPage: devices.perPage,
      totalItems: devices.totalItems,
      totalPages: devices.totalPages,
    });
  } catch (error) {
    logger.error(`Get devices error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /mobile/devices/:deviceId - Remove device
 */
router.delete('/devices/:deviceId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { deviceId } = req.params;

  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' });
  }

  try {
    const device = await pb.collection('mobile_devices').getOne(deviceId);
    if (!device || device.user_id !== userId) {
      return res.status(404).json({ error: 'Device not found or access denied' });
    }

    await pb.collection('mobile_devices').delete(deviceId);

    logger.info(`Mobile device removed: user_id=${userId}, device_id=${deviceId}`);

    res.json({
      success: true,
      message: 'Device removed successfully',
    });
  } catch (error) {
    logger.error(`Remove device error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /mobile/sync - Sync data between web and mobile
 */
router.post('/sync', requireAuth, async (req, res) => {
  const { userId } = req;
  const { device_id, sync_data } = req.body;

  if (!device_id) {
    return res.status(400).json({ error: 'Device ID is required' });
  }

  if (!sync_data) {
    return res.status(400).json({ error: 'Sync data is required' });
  }

  try {
    // Get device
    const device = await pb.collection('mobile_devices').getFirstListItem(
      `user_id = "${userId}" && device_id = "${device_id}"`
    );

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Create sync record
    const syncRecord = await pb.collection('mobile_sync').create({
      user_id: userId,
      device_id: device_id,
      sync_data: JSON.stringify(sync_data),
      sync_status: 'completed',
      synced_at: new Date().toISOString(),
    });

    // Update device last_sync_date
    await pb.collection('mobile_devices').update(device.id, {
      last_sync: new Date().toISOString(),
      last_seen: new Date().toISOString(),
    });

    logger.info(`Mobile sync completed: user_id=${userId}, device_id=${device_id}`);

    res.json({
      success: true,
      sync_id: syncRecord.id,
      sync_status: 'completed',
      synced_at: syncRecord.synced_at,
      message: 'Data synced successfully',
    });
  } catch (error) {
    logger.error(`Mobile sync error: ${error.message}`);
    throw error;
  }
});

export default router;