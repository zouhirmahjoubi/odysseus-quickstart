import 'dotenv/config';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

/**
 * Rate limiting middleware
 * Checks user's rate limit from database and enforces limits
 */
export const rateLimitMiddleware = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    
    // Skip rate limiting if no user ID
    if (!userId) {
      return next();
    }

    // Get or create rate limit record
    let rateLimitRecord;
    try {
      rateLimitRecord = await pb.collection('rate_limits').getFirstListItem(`user_id = "${userId}"`);
    } catch (error) {
      // Create default rate limit record
      rateLimitRecord = await pb.collection('rate_limits').create({
        user_id: userId,
        requests_per_minute: 60,
        requests_per_hour: 1000,
        requests_per_day: 10000,
        current_minute_count: 0,
        current_hour_count: 0,
        current_day_count: 0,
        minute_reset_at: new Date(Date.now() + 60000).toISOString(),
        hour_reset_at: new Date(Date.now() + 3600000).toISOString(),
        day_reset_at: new Date(Date.now() + 86400000).toISOString(),
      });
    }

    const now = new Date();

    // Reset counters if time windows have passed
    const updateData = {};
    if (new Date(rateLimitRecord.minute_reset_at) <= now) {
      updateData.current_minute_count = 0;
      updateData.minute_reset_at = new Date(now.getTime() + 60000).toISOString();
    }
    if (new Date(rateLimitRecord.hour_reset_at) <= now) {
      updateData.current_hour_count = 0;
      updateData.hour_reset_at = new Date(now.getTime() + 3600000).toISOString();
    }
    if (new Date(rateLimitRecord.day_reset_at) <= now) {
      updateData.current_day_count = 0;
      updateData.day_reset_at = new Date(now.getTime() + 86400000).toISOString();
    }

    // Update if any resets occurred
    if (Object.keys(updateData).length > 0) {
      rateLimitRecord = await pb.collection('rate_limits').update(rateLimitRecord.id, updateData);
    }

    // Check minute limit
    if (rateLimitRecord.current_minute_count >= rateLimitRecord.requests_per_minute) {
      logger.warn(`Rate limit exceeded (minute) for user ${userId}`);
      res.set('X-RateLimit-Limit', rateLimitRecord.requests_per_minute);
      res.set('X-RateLimit-Remaining', 0);
      res.set('X-RateLimit-Reset', new Date(rateLimitRecord.minute_reset_at).getTime() / 1000);
      return res.status(429).json({ error: 'Too many requests. Minute limit exceeded.' });
    }

    // Check hour limit
    if (rateLimitRecord.current_hour_count >= rateLimitRecord.requests_per_hour) {
      logger.warn(`Rate limit exceeded (hour) for user ${userId}`);
      res.set('X-RateLimit-Limit', rateLimitRecord.requests_per_hour);
      res.set('X-RateLimit-Remaining', 0);
      res.set('X-RateLimit-Reset', new Date(rateLimitRecord.hour_reset_at).getTime() / 1000);
      return res.status(429).json({ error: 'Too many requests. Hour limit exceeded.' });
    }

    // Check day limit
    if (rateLimitRecord.current_day_count >= rateLimitRecord.requests_per_day) {
      logger.warn(`Rate limit exceeded (day) for user ${userId}`);
      res.set('X-RateLimit-Limit', rateLimitRecord.requests_per_day);
      res.set('X-RateLimit-Remaining', 0);
      res.set('X-RateLimit-Reset', new Date(rateLimitRecord.day_reset_at).getTime() / 1000);
      return res.status(429).json({ error: 'Too many requests. Day limit exceeded.' });
    }

    // Increment counters
    const newMinuteCount = rateLimitRecord.current_minute_count + 1;
    const newHourCount = rateLimitRecord.current_hour_count + 1;
    const newDayCount = rateLimitRecord.current_day_count + 1;

    await pb.collection('rate_limits').update(rateLimitRecord.id, {
      current_minute_count: newMinuteCount,
      current_hour_count: newHourCount,
      current_day_count: newDayCount,
    });

    // Set rate limit headers
    res.set('X-RateLimit-Limit', rateLimitRecord.requests_per_minute);
    res.set('X-RateLimit-Remaining', Math.max(0, rateLimitRecord.requests_per_minute - newMinuteCount));
    res.set('X-RateLimit-Reset', new Date(rateLimitRecord.minute_reset_at).getTime() / 1000);

    next();
  } catch (error) {
    logger.error(`Rate limit middleware error: ${error.message}`);
    // Don't block request on middleware error
    next();
  }
};

export default rateLimitMiddleware;
