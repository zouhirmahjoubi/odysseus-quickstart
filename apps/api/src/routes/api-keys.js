import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { generateToken, hash } from '../utils/crypto.js';

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
 * GET /api-keys - List user's API keys (masked)
 */
router.get('/', requireAuth, async (req, res) => {
  const { userId } = req;

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const apiKeys = await pb.collection('api_keys').getList(page, perPage, {
      filter: `user_id = "${userId}"`,
      sort: '-created',
    });

    // Mask key values
    const maskedKeys = apiKeys.items.map((key) => ({
      id: key.id,
      name: key.name,
      masked_value: `${key.key_value.substring(0, 4)}...${key.key_value.substring(key.key_value.length - 4)}`,
      created_date: key.created,
      last_used_date: key.lastUsedAt || null,
      permissions: key.permissions ? JSON.parse(key.permissions) : [],
      active: key.active,
    }));

    logger.info(`Retrieved ${apiKeys.items.length} API keys for user ${userId}`);

    res.json({
      items: maskedKeys,
      page: apiKeys.page,
      perPage: apiKeys.perPage,
      totalItems: apiKeys.totalItems,
      totalPages: apiKeys.totalPages,
    });
  } catch (error) {
    logger.error(`Get API keys error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /api-keys - Generate new API key
 */
router.post('/', requireAuth, async (req, res) => {
  const { userId } = req;
  const { name, permissions } = req.body;

  // Validate required fields
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'API key name is required' });
  }

  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    return res.status(400).json({ error: 'At least one permission must be selected' });
  }

  const validPermissions = ['read', 'write', 'delete', 'admin'];
  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      return res.status(400).json({ error: `Invalid permission: ${permission}` });
    }
  }

  try {
    // Generate secure random key (32+ characters)
    const keyValue = generateToken(32);
    const hashedKey = hash(keyValue);

    const apiKey = await pb.collection('api_keys').create({
      user_id: userId,
      name: name.trim(),
      key_value: hashedKey,
      permissions: JSON.stringify(permissions),
      active: true,
      lastUsedAt: null,
    });

    logger.info(`API key created: id=${apiKey.id}, user_id=${userId}`);

    res.json({
      success: true,
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
        key: keyValue,
        permissions,
        created_date: apiKey.created,
        warning: 'Save this key in a safe place. You will not be able to see it again.',
      },
    });
  } catch (error) {
    logger.error(`Create API key error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /api-keys/:keyId - Delete API key
 */
router.delete('/:keyId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { keyId } = req.params;

  if (!keyId) {
    return res.status(400).json({ error: 'API key ID is required' });
  }

  try {
    // Check if API key exists and belongs to user
    const apiKey = await pb.collection('api_keys').getOne(keyId);
    if (!apiKey || apiKey.user_id !== userId) {
      return res.status(404).json({ error: 'API key not found or access denied' });
    }

    await pb.collection('api_keys').delete(keyId);

    logger.info(`API key deleted: id=${keyId}`);

    res.json({
      success: true,
      message: 'API key deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete API key error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /api-keys/:keyId/regenerate - Regenerate API key
 */
router.post('/:keyId/regenerate', requireAuth, async (req, res) => {
  const { userId } = req;
  const { keyId } = req.params;

  if (!keyId) {
    return res.status(400).json({ error: 'API key ID is required' });
  }

  try {
    // Check if API key exists and belongs to user
    const apiKey = await pb.collection('api_keys').getOne(keyId);
    if (!apiKey || apiKey.user_id !== userId) {
      return res.status(404).json({ error: 'API key not found or access denied' });
    }

    // Generate new key
    const newKeyValue = generateToken(32);
    const hashedKey = hash(newKeyValue);

    const updatedApiKey = await pb.collection('api_keys').update(keyId, {
      key_value: hashedKey,
    });

    logger.info(`API key regenerated: id=${keyId}`);

    res.json({
      success: true,
      apiKey: {
        id: updatedApiKey.id,
        name: updatedApiKey.name,
        key: newKeyValue,
        warning: 'Save this key in a safe place. You will not be able to see it again.',
      },
    });
  } catch (error) {
    logger.error(`Regenerate API key error: ${error.message}`);
    throw error;
  }
});

export default router;
