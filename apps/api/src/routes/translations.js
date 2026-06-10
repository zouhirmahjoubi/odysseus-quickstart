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
 * GET /languages - Get all available languages
 */
router.get('/languages', async (req, res) => {
  try {
    const languages = await pb.collection('languages').getFullList();

    const items = languages.map((lang) => ({
      code: lang.code,
      name: lang.name,
      native_name: lang.native_name,
      flag: lang.flag || '',
    }));

    logger.info(`Retrieved ${languages.length} available languages`);

    res.json({
      languages: items,
      count: items.length,
    });
  } catch (error) {
    logger.error(`Get languages error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /translations/:language - Get translations for specific language
 */
router.get('/:language', async (req, res) => {
  const { language } = req.params;

  if (!language) {
    return res.status(400).json({ error: 'Language code is required' });
  }

  try {
    const translations = await pb.collection('translations').getFullList({
      filter: `language_code = "${language}"`,
    });

    const translationMap = {};
    translations.forEach((t) => {
      translationMap[t.key] = t.value;
    });

    logger.info(`Retrieved ${translations.length} translations for language ${language}`);

    res.json(translationMap);
  } catch (error) {
    logger.error(`Get translations error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /translations - Add/update translation
 */
router.post('/', requireAuth, async (req, res) => {
  const { userId } = req;
  const { language_code, key, value } = req.body;

  if (!language_code) {
    return res.status(400).json({ error: 'Language code is required' });
  }

  if (!key || !key.trim()) {
    return res.status(400).json({ error: 'Translation key is required' });
  }

  if (!value || !value.trim()) {
    return res.status(400).json({ error: 'Translation value is required' });
  }

  try {
    // Check if translation already exists
    let translation;
    try {
      const existing = await pb.collection('translations').getFirstListItem(
        `language_code = "${language_code}" && key = "${key}"`
      );
      translation = await pb.collection('translations').update(existing.id, {
        value: value.trim(),
        updated_by: userId,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      // Create new translation
      translation = await pb.collection('translations').create({
        language_code,
        key: key.trim(),
        value: value.trim(),
        created_by: userId,
        created_at: new Date().toISOString(),
      });
    }

    logger.info(`Translation saved: language=${language_code}, key=${key}`);

    res.json({
      success: true,
      translation: {
        language_code: translation.language_code,
        key: translation.key,
        value: translation.value,
      },
    });
  } catch (error) {
    logger.error(`Save translation error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /translations/:key - Delete translation key across all languages
 */
router.delete('/:key', requireAuth, async (req, res) => {
  const { key } = req.params;

  if (!key) {
    return res.status(400).json({ error: 'Translation key is required' });
  }

  try {
    const translations = await pb.collection('translations').getFullList({
      filter: `key = "${key}"`,
    });

    let deletedCount = 0;
    for (const translation of translations) {
      await pb.collection('translations').delete(translation.id);
      deletedCount++;
    }

    logger.info(`Translation key deleted: key=${key}, languages=${deletedCount}`);

    res.json({
      success: true,
      message: `Translation key deleted from ${deletedCount} language(s)`,
      deleted_count: deletedCount,
    });
  } catch (error) {
    logger.error(`Delete translation error: ${error.message}`);
    throw error;
  }
});

export default router;