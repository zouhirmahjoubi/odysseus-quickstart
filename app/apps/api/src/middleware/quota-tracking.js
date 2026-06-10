import 'dotenv/config';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

/**
 * Quota tracking middleware
 * Tracks API calls, test runs, and agent installations per user
 */
export const quotaTrackingMiddleware = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    
    // Skip quota tracking if no user ID
    if (!userId) {
      return next();
    }

    // Get or create quota record
    let quotaRecord;
    try {
      quotaRecord = await pb.collection('quotas').getFirstListItem(`user_id = "${userId}"`);
    } catch (error) {
      // Create default quota record
      quotaRecord = await pb.collection('quotas').create({
        user_id: userId,
        api_calls_limit: 100000,
        test_runs_limit: 1000,
        agent_installations_limit: 50,
        api_calls_used: 0,
        test_runs_used: 0,
        agent_installations_used: 0,
        reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Check if quota period has expired
    const now = new Date();
    if (new Date(quotaRecord.reset_date) <= now) {
      // Reset quotas
      quotaRecord = await pb.collection('quotas').update(quotaRecord.id, {
        api_calls_used: 0,
        test_runs_used: 0,
        agent_installations_used: 0,
        reset_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Determine quota type based on endpoint
    let quotaType = 'api_calls';
    if (req.path.includes('/agent_tests')) {
      quotaType = 'test_runs';
    } else if (req.path.includes('/agents') && req.path.includes('/install') && req.method === 'POST') {
      quotaType = 'agent_installations';
    }

    // Check quota limits
    const quotaKey = `${quotaType}_used`;
    const limitKey = `${quotaType}_limit`;
    const currentUsage = quotaRecord[quotaKey] || 0;
    const limit = quotaRecord[limitKey] || 0;

    if (currentUsage >= limit) {
      logger.warn(`Quota exceeded (${quotaType}) for user ${userId}`);
      return res.status(402).json({ error: `Quota exceeded for ${quotaType}` });
    }

    // Check if quota is at 80% or 100% and send notification
    const usagePercentage = Math.round((currentUsage / limit) * 100);
    if (usagePercentage >= 80 && usagePercentage < 100) {
      // Log quota warning (in production, send email notification)
      logger.warn(`Quota warning (${usagePercentage}%) for user ${userId}: ${quotaType}`);
    } else if (usagePercentage >= 100) {
      logger.error(`Quota exceeded (100%) for user ${userId}: ${quotaType}`);
    }

    // Store quota info in request for later use
    req.quotaType = quotaType;
    req.quotaRecord = quotaRecord;

    // Increment quota usage after response is sent
    const originalSend = res.send;
    res.send = function (data) {
      // Only increment if request was successful (2xx status)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        pb.collection('quotas').update(quotaRecord.id, {
          [quotaKey]: currentUsage + 1,
        }).catch((error) => {
          logger.error(`Failed to update quota: ${error.message}`);
        });

        // Log quota usage
        pb.collection('quota_history').create({
          user_id: userId,
          quota_type: quotaType,
          usage_before: currentUsage,
          usage_after: currentUsage + 1,
          limit: limit,
          violation: currentUsage + 1 > limit,
          endpoint: req.path,
          method: req.method,
          timestamp: new Date().toISOString(),
        }).catch((error) => {
          logger.error(`Failed to log quota usage: ${error.message}`);
        });
      }

      return originalSend.call(this, data);
    };

    next();
  } catch (error) {
    logger.error(`Quota tracking middleware error: ${error.message}`);
    // Don't block request on middleware error
    next();
  }
};

export default quotaTrackingMiddleware;