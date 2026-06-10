import 'dotenv/config';
import express from 'express';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Store temporary secrets during setup (in production, use Redis or session store)
const tempSecrets = new Map();

/**
 * Helper function to encrypt a string
 */
function encrypt(text) {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-32-character-encryption-key';
  const IV_LENGTH = 16;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Helper function to hash a string (one-way)
 */
function hash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Helper function to generate random token
 */
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * POST /2fa/setup - Setup 2FA for user
 */
router.post('/setup', async (req, res) => {
  const { userId, method } = req.body;

  if (!userId || !method) {
    return res.status(400).json({ error: 'userId and method are required' });
  }

  const validMethods = ['TOTP', 'SMS', 'Email'];
  if (!validMethods.includes(method)) {
    return res.status(400).json({ error: `Invalid method. Must be one of: ${validMethods.join(', ')}` });
  }

  try {
    // Check if user exists
    const user = await pb.collection('users').getOne(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let setupData = {};

    if (method === 'TOTP') {
      // Generate TOTP secret
      const secret = speakeasy.generateSecret({
        name: `App (${user.email})`,
        issuer: 'App',
        length: 32,
      });

      // Generate QR code
      const qrCode = await QRCode.toDataURL(secret.otpauth_url);

      // Store temporary secret
      tempSecrets.set(userId, {
        secret: secret.base32,
        method: 'TOTP',
        createdAt: Date.now(),
      });

      setupData = {
        method: 'TOTP',
        secret: secret.base32,
        qrCode,
        message: 'Scan the QR code with your authenticator app and verify with the code',
      };
    } else if (method === 'SMS') {
      // Generate SMS code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Store temporary code
      tempSecrets.set(userId, {
        code,
        method: 'SMS',
        createdAt: Date.now(),
      });

      // TODO: Send SMS code to user's phone
      logger.info(`SMS 2FA code generated for user ${userId}: ${code}`);

      setupData = {
        method: 'SMS',
        message: 'SMS code sent to your registered phone number',
      };
    } else if (method === 'Email') {
      // Generate email code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Store temporary code
      tempSecrets.set(userId, {
        code,
        method: 'Email',
        createdAt: Date.now(),
      });

      // TODO: Send email code to user's email
      logger.info(`Email 2FA code generated for user ${userId}: ${code}`);

      setupData = {
        method: 'Email',
        message: 'Verification code sent to your email',
      };
    }

    logger.info(`2FA setup initiated for user ${userId} with method ${method}`);

    res.json(setupData);
  } catch (error) {
    logger.error(`2FA setup error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /2fa/verify - Verify 2FA code and enable 2FA
 */
router.post('/verify', async (req, res) => {
  const { userId, code } = req.body;

  if (!userId || !code) {
    return res.status(400).json({ error: 'userId and code are required' });
  }

  try {
    // Check if user exists
    const user = await pb.collection('users').getOne(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get temporary secret
    const tempSecret = tempSecrets.get(userId);
    if (!tempSecret) {
      return res.status(400).json({ error: '2FA setup not initiated. Call /2fa/setup first' });
    }

    // Verify code based on method
    let isValid = false;
    if (tempSecret.method === 'TOTP') {
      isValid = speakeasy.totp.verify({
        secret: tempSecret.secret,
        encoding: 'base32',
        token: code,
        window: 2,
      });
    } else if (tempSecret.method === 'SMS' || tempSecret.method === 'Email') {
      isValid = tempSecret.code === code;
    }

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () => generateToken(8));
    const hashedBackupCodes = backupCodes.map((code) => hash(code));

    // Encrypt secret if TOTP
    let encryptedSecret = '';
    if (tempSecret.method === 'TOTP') {
      encryptedSecret = encrypt(tempSecret.secret);
    }

    // Create 2FA record
    const twoFARecord = await pb.collection('two_factor_auth').create({
      user_id: userId,
      method: tempSecret.method,
      secret: encryptedSecret,
      backup_codes: JSON.stringify(hashedBackupCodes),
      enabled: true,
      verified_at: new Date().toISOString(),
    });

    // Clean up temporary secret
    tempSecrets.delete(userId);

    logger.info(`2FA enabled for user ${userId} with method ${tempSecret.method}`);

    res.json({
      success: true,
      message: '2FA enabled successfully',
      backupCodes,
      warning: 'Save these backup codes in a safe place. You can use them to access your account if you lose access to your 2FA device.',
    });
  } catch (error) {
    logger.error(`2FA verify error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /2fa/disable - Disable 2FA for user
 */
router.post('/disable', async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ error: 'userId and password are required' });
  }

  try {
    // Check if user exists
    const user = await pb.collection('users').getOne(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // TODO: Verify password
    // For now, just check if password is provided
    if (!password) {
      return res.status(400).json({ error: 'Password verification required' });
    }

    // Find and delete 2FA record
    try {
      const twoFARecord = await pb.collection('two_factor_auth').getFirstListItem(`user_id = "${userId}"`);
      await pb.collection('two_factor_auth').delete(twoFARecord.id);
    } catch (error) {
      return res.status(404).json({ error: '2FA not enabled for this user' });
    }

    logger.info(`2FA disabled for user ${userId}`);

    res.json({
      success: true,
      message: '2FA disabled successfully',
    });
  } catch (error) {
    logger.error(`2FA disable error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /2fa/backup-codes - Get masked backup codes
 */
router.get('/backup-codes', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    // Check if user exists
    const user = await pb.collection('users').getOne(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get 2FA record
    const twoFARecord = await pb.collection('two_factor_auth').getFirstListItem(`user_id = "${userId}"`);
    if (!twoFARecord) {
      return res.status(404).json({ error: '2FA not enabled for this user' });
    }

    // Parse backup codes and mask them
    const backupCodes = JSON.parse(twoFARecord.backup_codes || '[]');
    const maskedCodes = backupCodes.map((code) => `${code.substring(0, 4)}****`);

    logger.info(`Retrieved masked backup codes for user ${userId}`);

    res.json({
      backupCodes: maskedCodes,
      message: 'Use the regenerate endpoint to get new backup codes',
    });
  } catch (error) {
    logger.error(`Get backup codes error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /2fa/regenerate-backup-codes - Regenerate backup codes
 */
router.post('/regenerate-backup-codes', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    // Check if user exists
    const user = await pb.collection('users').getOne(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get 2FA record
    const twoFARecord = await pb.collection('two_factor_auth').getFirstListItem(`user_id = "${userId}"`);
    if (!twoFARecord) {
      return res.status(404).json({ error: '2FA not enabled for this user' });
    }

    // Generate new backup codes
    const backupCodes = Array.from({ length: 10 }, () => generateToken(8));
    const hashedBackupCodes = backupCodes.map((code) => hash(code));

    // Update 2FA record
    await pb.collection('two_factor_auth').update(twoFARecord.id, {
      backup_codes: JSON.stringify(hashedBackupCodes),
    });

    logger.info(`Backup codes regenerated for user ${userId}`);

    res.json({
      success: true,
      message: 'Backup codes regenerated successfully',
      backupCodes,
      warning: 'Save these backup codes in a safe place. Your old backup codes are no longer valid.',
    });
  } catch (error) {
    logger.error(`Regenerate backup codes error: ${error.message}`);
    throw error;
  }
});

export default router;
