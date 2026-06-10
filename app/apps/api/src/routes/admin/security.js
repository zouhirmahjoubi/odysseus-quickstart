import 'dotenv/config';
import express from 'express';
import pb from '../../utils/pocketbaseClient.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// Middleware to verify admin authentication
const requireAdmin = (req, res, next) => {
  const adminToken = req.headers['x-admin-token'];
  if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

/**
 * GET /admin/security/audit-log - List security audit events
 */
router.get('/audit-log', requireAdmin, async (req, res) => {
  const { event_type, user_id, startDate, endDate, q } = req.query;

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    let filter = '';
    if (event_type) filter += `event_type = "${event_type}"`;
    if (user_id) filter += (filter ? ' && ' : '') + `user_id = "${user_id}"`;
    if (startDate) filter += (filter ? ' && ' : '') + `created >= "${new Date(startDate).toISOString()}"`;
    if (endDate) filter += (filter ? ' && ' : '') + `created <= "${new Date(endDate).toISOString()}"`;
    if (q) filter += (filter ? ' && ' : '') + `ip_address ~ "${q}"`;

    const events = await pb.collection('audit_logs').getList(page, perPage, {
      filter: filter || undefined,
      sort: '-created',
    });

    logger.info(`Retrieved ${events.items.length} audit log events (page ${page})`);

    res.json({
      items: events.items,
      page: events.page,
      perPage: events.perPage,
      totalItems: events.totalItems,
      totalPages: events.totalPages,
    });
  } catch (error) {
    logger.error(`Get audit log error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /admin/security/alerts - List security alerts
 */
router.get('/alerts', requireAdmin, async (req, res) => {
  const { severity, alert_type, user_id } = req.query;

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    let filter = '';
    if (severity) filter += `severity = "${severity}"`;
    if (alert_type) filter += (filter ? ' && ' : '') + `alert_type = "${alert_type}"`;
    if (user_id) filter += (filter ? ' && ' : '') + `user_id = "${user_id}"`;

    const alerts = await pb.collection('security_alerts').getList(page, perPage, {
      filter: filter || undefined,
      sort: '-created',
    });

    logger.info(`Retrieved ${alerts.items.length} security alerts (page ${page})`);

    res.json({
      items: alerts.items,
      page: alerts.page,
      perPage: alerts.perPage,
      totalItems: alerts.totalItems,
      totalPages: alerts.totalPages,
    });
  } catch (error) {
    logger.error(`Get security alerts error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /admin/security/alerts/:alertId/acknowledge - Acknowledge alert
 */
router.post('/alerts/:alertId/acknowledge', requireAdmin, async (req, res) => {
  const { alertId } = req.params;

  if (!alertId) {
    return res.status(400).json({ error: 'Alert ID is required' });
  }

  try {
    const alert = await pb.collection('security_alerts').getOne(alertId);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const updatedAlert = await pb.collection('security_alerts').update(alertId, {
      status: 'acknowledged',
      acknowledged_at: new Date().toISOString(),
    });

    logger.info(`Security alert acknowledged: id=${alertId}`);

    res.json({
      success: true,
      alert: updatedAlert,
    });
  } catch (error) {
    logger.error(`Acknowledge alert error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /admin/security/alerts/:alertId/resolve - Resolve alert
 */
router.post('/alerts/:alertId/resolve', requireAdmin, async (req, res) => {
  const { alertId } = req.params;
  const { resolution_notes } = req.body;

  if (!alertId) {
    return res.status(400).json({ error: 'Alert ID is required' });
  }

  try {
    const alert = await pb.collection('security_alerts').getOne(alertId);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const updatedAlert = await pb.collection('security_alerts').update(alertId, {
      status: 'resolved',
      resolution_notes: resolution_notes || '',
      resolved_at: new Date().toISOString(),
    });

    logger.info(`Security alert resolved: id=${alertId}`);

    res.json({
      success: true,
      alert: updatedAlert,
    });
  } catch (error) {
    logger.error(`Resolve alert error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /admin/security/ip-management - Get IP whitelist and blacklist
 */
router.get('/ip-management', requireAdmin, async (req, res) => {
  try {
    const whitelist = await pb.collection('ip_whitelist').getFullList();
    const blacklist = await pb.collection('ip_blacklist').getFullList();

    logger.info(`Retrieved IP management lists: ${whitelist.length} whitelisted, ${blacklist.length} blacklisted`);

    res.json({
      whitelist: whitelist.map((ip) => ({
        id: ip.id,
        ip_address: ip.ip_address,
        ip_range: ip.ip_range,
        description: ip.description,
        added_at: ip.created,
      })),
      blacklist: blacklist.map((ip) => ({
        id: ip.id,
        ip_address: ip.ip_address,
        ip_range: ip.ip_range,
        reason: ip.reason,
        added_at: ip.created,
      })),
    });
  } catch (error) {
    logger.error(`Get IP management error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /admin/security/ip-management/whitelist - Add IP to whitelist
 */
router.post('/ip-management/whitelist', requireAdmin, async (req, res) => {
  const { ip_address, ip_range, description } = req.body;

  if (!ip_address && !ip_range) {
    return res.status(400).json({ error: 'Either ip_address or ip_range is required' });
  }

  // Validate IP format
  if (ip_address && !isValidIP(ip_address)) {
    return res.status(400).json({ error: 'Invalid IP address format' });
  }

  if (ip_range && !isValidCIDR(ip_range)) {
    return res.status(400).json({ error: 'Invalid CIDR notation' });
  }

  try {
    const entry = await pb.collection('ip_whitelist').create({
      ip_address: ip_address || '',
      ip_range: ip_range || '',
      description: description || '',
    });

    logger.info(`IP added to whitelist: ${ip_address || ip_range}`);

    res.json({
      success: true,
      entry: {
        id: entry.id,
        ip_address: entry.ip_address,
        ip_range: entry.ip_range,
        description: entry.description,
      },
    });
  } catch (error) {
    logger.error(`Add to whitelist error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /admin/security/ip-management/whitelist/:ip - Remove IP from whitelist
 */
router.delete('/ip-management/whitelist/:ip', requireAdmin, async (req, res) => {
  const { ip } = req.params;

  if (!ip) {
    return res.status(400).json({ error: 'IP is required' });
  }

  try {
    const entry = await pb.collection('ip_whitelist').getFirstListItem(
      `ip_address = "${ip}" || ip_range = "${ip}"`
    );
    if (!entry) {
      return res.status(404).json({ error: 'IP not found in whitelist' });
    }

    await pb.collection('ip_whitelist').delete(entry.id);

    logger.info(`IP removed from whitelist: ${ip}`);

    res.json({
      success: true,
      message: 'IP removed from whitelist',
    });
  } catch (error) {
    logger.error(`Remove from whitelist error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /admin/security/ip-management/blacklist - Add IP to blacklist
 */
router.post('/ip-management/blacklist', requireAdmin, async (req, res) => {
  const { ip_address, ip_range, reason } = req.body;

  if (!ip_address && !ip_range) {
    return res.status(400).json({ error: 'Either ip_address or ip_range is required' });
  }

  if (ip_address && !isValidIP(ip_address)) {
    return res.status(400).json({ error: 'Invalid IP address format' });
  }

  if (ip_range && !isValidCIDR(ip_range)) {
    return res.status(400).json({ error: 'Invalid CIDR notation' });
  }

  try {
    const entry = await pb.collection('ip_blacklist').create({
      ip_address: ip_address || '',
      ip_range: ip_range || '',
      reason: reason || '',
    });

    logger.info(`IP added to blacklist: ${ip_address || ip_range}`);

    res.json({
      success: true,
      entry: {
        id: entry.id,
        ip_address: entry.ip_address,
        ip_range: entry.ip_range,
        reason: entry.reason,
      },
    });
  } catch (error) {
    logger.error(`Add to blacklist error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /admin/security/ip-management/blacklist/:ip - Remove IP from blacklist
 */
router.delete('/ip-management/blacklist/:ip', requireAdmin, async (req, res) => {
  const { ip } = req.params;

  if (!ip) {
    return res.status(400).json({ error: 'IP is required' });
  }

  try {
    const entry = await pb.collection('ip_blacklist').getFirstListItem(
      `ip_address = "${ip}" || ip_range = "${ip}"`
    );
    if (!entry) {
      return res.status(404).json({ error: 'IP not found in blacklist' });
    }

    await pb.collection('ip_blacklist').delete(entry.id);

    logger.info(`IP removed from blacklist: ${ip}`);

    res.json({
      success: true,
      message: 'IP removed from blacklist',
    });
  } catch (error) {
    logger.error(`Remove from blacklist error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /admin/security/sessions - List all active sessions
 */
router.get('/sessions', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    const sessions = await pb.collection('user_sessions').getList(page, perPage, {
      sort: '-last_activity',
    });

    logger.info(`Retrieved ${sessions.items.length} active sessions (page ${page})`);

    res.json({
      items: sessions.items,
      page: sessions.page,
      perPage: sessions.perPage,
      totalItems: sessions.totalItems,
      totalPages: sessions.totalPages,
    });
  } catch (error) {
    logger.error(`Get sessions error: ${error.message}`);
    throw error;
  }
});

/**
 * DELETE /admin/security/sessions/:sessionId - Terminate session
 */
router.delete('/sessions/:sessionId', requireAdmin, async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  try {
    const session = await pb.collection('user_sessions').getOne(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await pb.collection('user_sessions').delete(sessionId);

    logger.info(`Session terminated: id=${sessionId}`);

    res.json({
      success: true,
      message: 'Session terminated successfully',
    });
  } catch (error) {
    logger.error(`Terminate session error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /admin/security/vulnerabilities - List detected vulnerabilities
 */
router.get('/vulnerabilities', requireAdmin, async (req, res) => {
  const { severity, status } = req.query;

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    let filter = '';
    if (severity) filter += `severity = "${severity}"`;
    if (status) filter += (filter ? ' && ' : '') + `status = "${status}"`;

    const vulnerabilities = await pb.collection('vulnerabilities').getList(page, perPage, {
      filter: filter || undefined,
      sort: '-created',
    });

    logger.info(`Retrieved ${vulnerabilities.items.length} vulnerabilities (page ${page})`);

    res.json({
      items: vulnerabilities.items,
      page: vulnerabilities.page,
      perPage: vulnerabilities.perPage,
      totalItems: vulnerabilities.totalItems,
      totalPages: vulnerabilities.totalPages,
    });
  } catch (error) {
    logger.error(`Get vulnerabilities error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /admin/security/vulnerabilities/scan - Scan for vulnerabilities
 */
router.post('/vulnerabilities/scan', requireAdmin, async (req, res) => {
  try {
    const scanId = `scan_${Date.now()}`;
    const vulnerabilities = [];

    // Simulate security scan
    const scanResults = [
      {
        type: 'weak_password_policy',
        severity: 'medium',
        description: 'Some users have weak passwords',
        affected_count: 5,
      },
      {
        type: 'outdated_dependencies',
        severity: 'high',
        description: 'Some npm packages are outdated',
        affected_count: 3,
      },
      {
        type: 'missing_2fa',
        severity: 'medium',
        description: 'Admin users without 2FA enabled',
        affected_count: 2,
      },
    ];

    // Save vulnerabilities
    for (const result of scanResults) {
      const vuln = await pb.collection('vulnerabilities').create({
        scan_id: scanId,
        type: result.type,
        severity: result.severity,
        description: result.description,
        affected_count: result.affected_count,
        status: 'open',
        discovered_at: new Date().toISOString(),
      });
      vulnerabilities.push(vuln);
    }

    logger.info(`Security scan completed: scan_id=${scanId}, vulnerabilities=${vulnerabilities.length}`);

    res.json({
      success: true,
      scan_id: scanId,
      vulnerabilities_found: vulnerabilities.length,
      results: vulnerabilities,
    });
  } catch (error) {
    logger.error(`Vulnerability scan error: ${error.message}`);
    throw error;
  }
});

// Helper function to validate IP address
function isValidIP(ip) {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

// Helper function to validate CIDR notation
function isValidCIDR(cidr) {
  const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/(\d{1,2})$/;
  return cidrRegex.test(cidr);
}

export default router;