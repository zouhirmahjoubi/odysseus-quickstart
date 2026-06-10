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
 * GET /ab-tests - List A/B tests with pagination
 */
router.get('/', requireAuth, async (req, res) => {
  const { userId } = req;
  const { status } = req.query;

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    let filter = `user_id = "${userId}"`;
    if (status) filter += ` && status = "${status}"`;

    const tests = await pb.collection('ab_tests').getList(page, perPage, {
      filter,
      sort: '-created',
    });

    const items = tests.items.map((test) => ({
      id: test.id,
      name: test.name,
      description: test.description,
      status: test.status,
      type: test.type,
      start_date: test.start_date,
      end_date: test.end_date,
      variants: test.variants ? JSON.parse(test.variants) : [],
      conversion_rate_a: test.conversion_rate_a || 0,
      conversion_rate_b: test.conversion_rate_b || 0,
      created_date: test.created,
    }));

    logger.info(`Retrieved ${tests.items.length} A/B tests for user ${userId}`);

    res.json({
      items,
      page: tests.page,
      perPage: tests.perPage,
      totalItems: tests.totalItems,
      totalPages: tests.totalPages,
    });
  } catch (error) {
    logger.error(`Get A/B tests error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /ab-tests - Create A/B test
 */
router.post('/', requireAuth, async (req, res) => {
  const { userId } = req;
  const { name, description, type, variants, audience, metrics, settings } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Test name is required' });
  }

  if (!type) {
    return res.status(400).json({ error: 'Test type is required' });
  }

  if (!variants || !Array.isArray(variants) || variants.length < 2) {
    return res.status(400).json({ error: 'At least 2 variants are required' });
  }

  if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
    return res.status(400).json({ error: 'At least one metric is required' });
  }

  try {
    const test = await pb.collection('ab_tests').create({
      user_id: userId,
      name: name.trim(),
      description: description ? description.trim() : '',
      type,
      variants: JSON.stringify(variants),
      audience: audience ? JSON.stringify(audience) : '{}',
      metrics: JSON.stringify(metrics),
      settings: settings ? JSON.stringify(settings) : '{}',
      status: 'draft',
      conversion_rate_a: 0,
      conversion_rate_b: 0,
      created_at: new Date().toISOString(),
    });

    logger.info(`A/B test created: id=${test.id}, user_id=${userId}`);

    res.json({
      success: true,
      test: {
        id: test.id,
        name: test.name,
        description: test.description,
        type: test.type,
        status: test.status,
        variants: variants,
        metrics: metrics,
        created_date: test.created,
      },
    });
  } catch (error) {
    logger.error(`Create A/B test error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /ab-tests/:testId - Get test details
 */
router.get('/:testId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { testId } = req.params;

  if (!testId) {
    return res.status(400).json({ error: 'Test ID is required' });
  }

  try {
    const test = await pb.collection('ab_tests').getOne(testId);
    if (!test || test.user_id !== userId) {
      return res.status(404).json({ error: 'Test not found or access denied' });
    }

    // Get assignments
    const assignments = await pb.collection('ab_test_assignments').getFullList({
      filter: `test_id = "${testId}"`,
    });

    logger.info(`Retrieved A/B test ${testId}`);

    res.json({
      id: test.id,
      name: test.name,
      description: test.description,
      type: test.type,
      status: test.status,
      variants: test.variants ? JSON.parse(test.variants) : [],
      audience: test.audience ? JSON.parse(test.audience) : {},
      metrics: test.metrics ? JSON.parse(test.metrics) : [],
      settings: test.settings ? JSON.parse(test.settings) : {},
      start_date: test.start_date,
      end_date: test.end_date,
      conversion_rate_a: test.conversion_rate_a || 0,
      conversion_rate_b: test.conversion_rate_b || 0,
      assignment_count: assignments.length,
      created_date: test.created,
    });
  } catch (error) {
    logger.error(`Get A/B test error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /ab-tests/:testId/start - Start A/B test
 */
router.post('/:testId/start', requireAuth, async (req, res) => {
  const { userId } = req;
  const { testId } = req.params;

  if (!testId) {
    return res.status(400).json({ error: 'Test ID is required' });
  }

  try {
    const test = await pb.collection('ab_tests').getOne(testId);
    if (!test || test.user_id !== userId) {
      return res.status(404).json({ error: 'Test not found or access denied' });
    }

    if (test.status !== 'draft') {
      return res.status(400).json({ error: 'Only draft tests can be started' });
    }

    const updatedTest = await pb.collection('ab_tests').update(testId, {
      status: 'running',
      start_date: new Date().toISOString(),
    });

    logger.info(`A/B test started: id=${testId}`);

    res.json({
      success: true,
      test: {
        id: updatedTest.id,
        status: updatedTest.status,
        start_date: updatedTest.start_date,
      },
    });
  } catch (error) {
    logger.error(`Start A/B test error: ${error.message}`);
    throw error;
  }
});

/**
 * POST /ab-tests/:testId/end - End A/B test
 */
router.post('/:testId/end', requireAuth, async (req, res) => {
  const { userId } = req;
  const { testId } = req.params;

  if (!testId) {
    return res.status(400).json({ error: 'Test ID is required' });
  }

  try {
    const test = await pb.collection('ab_tests').getOne(testId);
    if (!test || test.user_id !== userId) {
      return res.status(404).json({ error: 'Test not found or access denied' });
    }

    if (test.status !== 'running') {
      return res.status(400).json({ error: 'Only running tests can be ended' });
    }

    // Get all assignments and calculate results
    const assignments = await pb.collection('ab_test_assignments').getFullList({
      filter: `test_id = "${testId}"`,
    });

    const variantA = assignments.filter((a) => a.variant === 'A');
    const variantB = assignments.filter((a) => a.variant === 'B');

    const conversionA = variantA.filter((a) => a.converted).length;
    const conversionB = variantB.filter((a) => a.converted).length;

    const conversionRateA = variantA.length > 0 ? (conversionA / variantA.length) * 100 : 0;
    const conversionRateB = variantB.length > 0 ? (conversionB / variantB.length) * 100 : 0;

    // Simple statistical significance check (chi-square test)
    const isSignificant = calculateStatisticalSignificance(variantA.length, conversionA, variantB.length, conversionB);
    const winner = conversionRateA > conversionRateB ? 'A' : 'B';

    const updatedTest = await pb.collection('ab_tests').update(testId, {
      status: 'completed',
      end_date: new Date().toISOString(),
      conversion_rate_a: conversionRateA,
      conversion_rate_b: conversionRateB,
      winner: isSignificant ? winner : null,
      is_significant: isSignificant,
    });

    logger.info(`A/B test ended: id=${testId}, winner=${winner}, significant=${isSignificant}`);

    res.json({
      success: true,
      test: {
        id: updatedTest.id,
        status: updatedTest.status,
        end_date: updatedTest.end_date,
        conversion_rate_a: conversionRateA,
        conversion_rate_b: conversionRateB,
        winner: isSignificant ? winner : null,
        is_significant: isSignificant,
      },
    });
  } catch (error) {
    logger.error(`End A/B test error: ${error.message}`);
    throw error;
  }
});

/**
 * GET /ab-tests/:testId/results - Get detailed test results
 */
router.get('/:testId/results', requireAuth, async (req, res) => {
  const { userId } = req;
  const { testId } = req.params;

  if (!testId) {
    return res.status(400).json({ error: 'Test ID is required' });
  }

  try {
    const test = await pb.collection('ab_tests').getOne(testId);
    if (!test || test.user_id !== userId) {
      return res.status(404).json({ error: 'Test not found or access denied' });
    }

    const assignments = await pb.collection('ab_test_assignments').getFullList({
      filter: `test_id = "${testId}"`,
    });

    const variantA = assignments.filter((a) => a.variant === 'A');
    const variantB = assignments.filter((a) => a.variant === 'B');

    const conversionA = variantA.filter((a) => a.converted).length;
    const conversionB = variantB.filter((a) => a.converted).length;

    const conversionRateA = variantA.length > 0 ? (conversionA / variantA.length) * 100 : 0;
    const conversionRateB = variantB.length > 0 ? (conversionB / variantB.length) * 100 : 0;

    const lift = conversionRateA > 0 ? ((conversionRateB - conversionRateA) / conversionRateA) * 100 : 0;
    const isSignificant = calculateStatisticalSignificance(variantA.length, conversionA, variantB.length, conversionB);
    const pValue = calculatePValue(variantA.length, conversionA, variantB.length, conversionB);

    logger.info(`Retrieved results for A/B test ${testId}`);

    res.json({
      test_id: testId,
      status: test.status,
      variant_a: {
        name: 'Variant A',
        sample_size: variantA.length,
        conversions: conversionA,
        conversion_rate: conversionRateA,
        confidence_interval: calculateConfidenceInterval(conversionRateA, variantA.length),
      },
      variant_b: {
        name: 'Variant B',
        sample_size: variantB.length,
        conversions: conversionB,
        conversion_rate: conversionRateB,
        confidence_interval: calculateConfidenceInterval(conversionRateB, variantB.length),
      },
      lift: lift,
      p_value: pValue,
      is_significant: isSignificant,
      winner: test.winner || null,
      recommendation: isSignificant ? `Variant ${test.winner} is the winner` : 'Test is not yet statistically significant',
    });
  } catch (error) {
    logger.error(`Get A/B test results error: ${error.message}`);
    throw error;
  }
});

// Helper function to calculate statistical significance (simplified chi-square)
function calculateStatisticalSignificance(n1, conversions1, n2, conversions2) {
  if (n1 === 0 || n2 === 0) return false;
  
  const p1 = conversions1 / n1;
  const p2 = conversions2 / n2;
  const p = (conversions1 + conversions2) / (n1 + n2);
  
  const z = Math.abs((p1 - p2) / Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2)));
  
  // 95% confidence level (z > 1.96)
  return z > 1.96;
}

// Helper function to calculate p-value
function calculatePValue(n1, conversions1, n2, conversions2) {
  if (n1 === 0 || n2 === 0) return 1;
  
  const p1 = conversions1 / n1;
  const p2 = conversions2 / n2;
  const p = (conversions1 + conversions2) / (n1 + n2);
  
  const z = Math.abs((p1 - p2) / Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2)));
  
  // Approximate p-value using normal distribution
  return 2 * (1 - normalCDF(z));
}

// Helper function for normal CDF
function normalCDF(z) {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = z < 0 ? -1 : 1;
  z = Math.abs(z) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * z);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

  return 0.5 * (1.0 + sign * y);
}

// Helper function to calculate confidence interval
function calculateConfidenceInterval(rate, sampleSize) {
  const z = 1.96; // 95% confidence
  const margin = z * Math.sqrt((rate / 100) * (1 - rate / 100) / sampleSize);
  return {
    lower: Math.max(0, rate - margin * 100),
    upper: Math.min(100, rate + margin * 100),
  };
}

export default router;