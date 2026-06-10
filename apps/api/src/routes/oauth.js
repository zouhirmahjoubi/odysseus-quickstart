import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { createToken } from '../utils/jwt.js';
import { generateToken } from '../utils/crypto.js';

const router = express.Router();

// Store state tokens temporarily (in production, use Redis or session store)
const stateTokens = new Map();

/**
 * POST /oauth/google - Initiate Google OAuth2 flow
 */
router.post('/google', async (req, res) => {
  const state = generateToken(32);
  stateTokens.set(state, { provider: 'google', createdAt: Date.now() });

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email',
    state,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  logger.info(`Google OAuth initiated with state: ${state}`);

  res.json({ authUrl });
});

/**
 * GET /oauth/google/callback - Handle Google OAuth2 callback
 */
router.get('/google/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ error: 'Missing code or state parameter' });
  }

  // Verify state token
  const stateData = stateTokens.get(state);
  if (!stateData || stateData.provider !== 'google') {
    return res.status(400).json({ error: 'Invalid state token' });
  }

  // Clean up state token
  stateTokens.delete(state);

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to exchange code for token: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user profile from Google
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileResponse.ok) {
      throw new Error(`Failed to fetch Google profile: ${profileResponse.statusText}`);
    }

    const profile = await profileResponse.json();

    // Create or update user
    let user;
    try {
      user = await pb.collection('users').getFirstListItem(`email = "${profile.email}"`);
      // Update existing user
      user = await pb.collection('users').update(user.id, {
        name: profile.name || user.name,
        avatar: profile.picture || user.avatar,
      });
    } catch (error) {
      // Create new user
      user = await pb.collection('users').create({
        email: profile.email,
        name: profile.name || 'User',
        avatar: profile.picture || '',
        emailVerified: true,
      });
    }

    // Create or update oauth_accounts record
    try {
      const existingOAuth = await pb.collection('oauth_accounts').getFirstListItem(`user_id = "${user.id}" && provider = "google"`);
      await pb.collection('oauth_accounts').update(existingOAuth.id, {
        provider_id: profile.id,
        access_token: accessToken,
        token_type: tokenData.token_type,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      });
    } catch (error) {
      // Create new oauth_accounts record
      await pb.collection('oauth_accounts').create({
        user_id: user.id,
        provider: 'google',
        provider_id: profile.id,
        access_token: accessToken,
        token_type: tokenData.token_type,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      });
    }

    // Create JWT token
    const jwtToken = createToken({ userId: user.id, email: user.email });

    logger.info(`Google OAuth successful for user: ${user.id}`);

    // Redirect to dashboard with token
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?token=${jwtToken}`;
    res.redirect(redirectUrl);
  } catch (error) {
    logger.error(`Google OAuth error: ${error.message}`);
    const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=${encodeURIComponent(error.message)}`;
    res.redirect(errorUrl);
  }
});

/**
 * POST /oauth/github - Initiate GitHub OAuth2 flow
 */
router.post('/github', async (req, res) => {
  const state = generateToken(32);
  stateTokens.set(state, { provider: 'github', createdAt: Date.now() });

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_REDIRECT_URI,
    scope: 'user:email',
    state,
  });

  const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;

  logger.info(`GitHub OAuth initiated with state: ${state}`);

  res.json({ authUrl });
});

/**
 * GET /oauth/github/callback - Handle GitHub OAuth2 callback
 */
router.get('/github/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ error: 'Missing code or state parameter' });
  }

  // Verify state token
  const stateData = stateTokens.get(state);
  if (!stateData || stateData.provider !== 'github') {
    return res.status(400).json({ error: 'Invalid state token' });
  }

  // Clean up state token
  stateTokens.delete(state);

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to exchange code for token: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user profile from GitHub
    const profileResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileResponse.ok) {
      throw new Error(`Failed to fetch GitHub profile: ${profileResponse.statusText}`);
    }

    const profile = await profileResponse.json();

    // Fetch user email from GitHub
    let email = profile.email;
    if (!email) {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (emailResponse.ok) {
        const emails = await emailResponse.json();
        const primaryEmail = emails.find((e) => e.primary);
        email = primaryEmail?.email || emails[0]?.email;
      }
    }

    if (!email) {
      throw new Error('Could not retrieve email from GitHub');
    }

    // Create or update user
    let user;
    try {
      user = await pb.collection('users').getFirstListItem(`email = "${email}"`);
      // Update existing user
      user = await pb.collection('users').update(user.id, {
        name: profile.name || user.name,
        avatar: profile.avatar_url || user.avatar,
      });
    } catch (error) {
      // Create new user
      user = await pb.collection('users').create({
        email,
        name: profile.name || profile.login || 'User',
        avatar: profile.avatar_url || '',
        emailVerified: true,
      });
    }

    // Create or update oauth_accounts record
    try {
      const existingOAuth = await pb.collection('oauth_accounts').getFirstListItem(`user_id = "${user.id}" && provider = "github"`);
      await pb.collection('oauth_accounts').update(existingOAuth.id, {
        provider_id: profile.id.toString(),
        access_token: accessToken,
        token_type: 'bearer',
      });
    } catch (error) {
      // Create new oauth_accounts record
      await pb.collection('oauth_accounts').create({
        user_id: user.id,
        provider: 'github',
        provider_id: profile.id.toString(),
        access_token: accessToken,
        token_type: 'bearer',
      });
    }

    // Create JWT token
    const jwtToken = createToken({ userId: user.id, email: user.email });

    logger.info(`GitHub OAuth successful for user: ${user.id}`);

    // Redirect to dashboard with token
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?token=${jwtToken}`;
    res.redirect(redirectUrl);
  } catch (error) {
    logger.error(`GitHub OAuth error: ${error.message}`);
    const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=${encodeURIComponent(error.message)}`;
    res.redirect(errorUrl);
  }
});

/**
 * POST /oauth/apple - Initiate Apple OAuth2 flow
 */
router.post('/apple', async (req, res) => {
  const state = generateToken(32);
  stateTokens.set(state, { provider: 'apple', createdAt: Date.now() });

  const params = new URLSearchParams({
    client_id: process.env.APPLE_CLIENT_ID,
    redirect_uri: process.env.APPLE_REDIRECT_URI,
    response_type: 'code',
    response_mode: 'form_post',
    scope: 'openid email name',
    state,
  });

  const authUrl = `https://appleid.apple.com/auth/authorize?${params.toString()}`;

  logger.info(`Apple OAuth initiated with state: ${state}`);

  res.json({ authUrl });
});

/**
 * GET /oauth/apple/callback - Handle Apple OAuth2 callback
 */
router.get('/apple/callback', async (req, res) => {
  const { code, state, user } = req.query;

  if (!code || !state) {
    return res.status(400).json({ error: 'Missing code or state parameter' });
  }

  // Verify state token
  const stateData = stateTokens.get(state);
  if (!stateData || stateData.provider !== 'apple') {
    return res.status(400).json({ error: 'Invalid state token' });
  }

  // Clean up state token
  stateTokens.delete(state);

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.APPLE_CLIENT_ID,
        client_secret: process.env.APPLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.APPLE_REDIRECT_URI,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to exchange code for token: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();

    // Parse user info from JWT (Apple returns user info in id_token)
    let profile = {};
    if (user) {
      try {
        profile = JSON.parse(user);
      } catch (e) {
        logger.warn('Could not parse Apple user info');
      }
    }

    const email = profile.email || `apple-${generateToken(16)}@appleid.apple.com`;
    const name = profile.name?.firstName || 'Apple User';

    // Create or update user
    let userRecord;
    try {
      userRecord = await pb.collection('users').getFirstListItem(`email = "${email}"`);
      // Update existing user
      userRecord = await pb.collection('users').update(userRecord.id, {
        name: name || userRecord.name,
      });
    } catch (error) {
      // Create new user
      userRecord = await pb.collection('users').create({
        email,
        name: name || 'Apple User',
        emailVerified: true,
      });
    }

    // Create or update oauth_accounts record
    try {
      const existingOAuth = await pb.collection('oauth_accounts').getFirstListItem(`user_id = "${userRecord.id}" && provider = "apple"`);
      await pb.collection('oauth_accounts').update(existingOAuth.id, {
        provider_id: profile.sub || generateToken(16),
        access_token: tokenData.access_token,
        token_type: tokenData.token_type,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      });
    } catch (error) {
      // Create new oauth_accounts record
      await pb.collection('oauth_accounts').create({
        user_id: userRecord.id,
        provider: 'apple',
        provider_id: profile.sub || generateToken(16),
        access_token: tokenData.access_token,
        token_type: tokenData.token_type,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      });
    }

    // Create JWT token
    const jwtToken = createToken({ userId: userRecord.id, email: userRecord.email });

    logger.info(`Apple OAuth successful for user: ${userRecord.id}`);

    // Redirect to dashboard with token
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?token=${jwtToken}`;
    res.redirect(redirectUrl);
  } catch (error) {
    logger.error(`Apple OAuth error: ${error.message}`);
    const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=${encodeURIComponent(error.message)}`;
    res.redirect(errorUrl);
  }
});

export default router;
