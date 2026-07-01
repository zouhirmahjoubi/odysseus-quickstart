import express from 'express';
import Stripe from 'stripe';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Map known products to Stripe Price IDs
const PRICE_MAP = {
  'Odysseus AI Launch Kit & Toolkit': 'price_1TgLDsDXGaQiqfvurMfFrRSX',
};

// Create Checkout Session
router.post('/create-checkout', async (req, res) => {
  const { amount, productName, successUrl, cancelUrl } = req.body;

  if (!amount || !productName || !successUrl || !cancelUrl) {
    return res.status(400).json({ error: 'Missing required fields: amount, productName, successUrl, cancelUrl' });
  }

  // Fallback to Mock Checkout if STRIPE_SECRET_KEY is a placeholder
  const isPlaceholder = !process.env.STRIPE_SECRET_KEY || 
                        process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder' || 
                        process.env.STRIPE_SECRET_KEY.includes('placeholder');
                        
  if (isPlaceholder) {
    const productSlug = productName.toLowerCase().includes('launch kit') ? 'launchkit' : 'hardenedstack';
    const mockSessionId = `mock_session_${productSlug}_${Date.now()}`;
    const redirectUrl = successUrl.replace('{CHECKOUT_SESSION_ID}', mockSessionId);
    return res.json({ url: redirectUrl });
  }

  try {
    const priceId = PRICE_MAP[productName];
    const lineItem = priceId
      ? { price: priceId, quantity: 1 }
      : {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [lineItem],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Session Creation Error:", error);
    res.status(500).json({ 
      error: 'Failed to initiate Stripe checkout',
      details: error.message 
    });
  }
});

// Retrieve Checkout Session
router.get('/session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  // Intercept mock sessions for local testing
  if (sessionId.startsWith('mock_session_')) {
    const isLaunchKit = sessionId.includes('launchkit');
    const isCart = sessionId.includes('cart');
    return res.json({
      id: sessionId,
      status: 'paid',
      amountTotal: isLaunchKit ? 1999 : (isCart ? 49900 : 7900),
      customerEmail: 'mock-customer@example.com',
      lineItems: [
        {
          description: isLaunchKit ? 'Odysseus AI Launch Kit & Toolkit' : (isCart ? 'Model Starter Pack' : 'Hardened Stack'),
          amount_total: isLaunchKit ? 1999 : (isCart ? 49900 : 7900),
          quantity: 1,
        }
      ],
    });
  }

  try {
    let session;
    if (sessionId.startsWith('pi_')) {
      const sessions = await stripe.checkout.sessions.list({
        payment_intent: sessionId,
        limit: 1
      });
      if (sessions.data && sessions.data.length > 0) {
        session = await stripe.checkout.sessions.retrieve(sessions.data[0].id, {
          expand: ['line_items']
        });
      }
    } else {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items']
      });
    }

    if (!session) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    res.json({
      id: session.id,
      status: session.payment_status,
      amountTotal: session.amount_total,
      customerEmail: session.customer_details?.email,
      lineItems: session.line_items?.data || [],
    });
  } catch (error) {
    console.error("Stripe Session Retrieval Error:", error);
    res.status(500).json({ 
      error: 'Failed to retrieve checkout session',
      details: error.message 
    });
  }
});

// Secure file download after payment verification
router.get('/download/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  let hasPurchased = false;
  let targetFile = '';
  let fileNameToDownload = '';

  // 1. Handle mock sessions for local testing
  if (sessionId.startsWith('mock_session_')) {
    hasPurchased = true;
    if (sessionId.includes('launchkit') || sessionId.includes('toolkit')) {
      targetFile = 'toolkit.zip';
      fileNameToDownload = 'odysseus-launch-kit.zip';
    } else if (sessionId.includes('hardenedstack')) {
      targetFile = 'hardened-stack.zip';
      fileNameToDownload = 'hardened-stack.zip';
    } else {
      // Default fallback for general testing
      targetFile = 'toolkit.zip';
      fileNameToDownload = 'odysseus-launch-kit.zip';
    }
  } else {
    // 2. Handle real Stripe sessions
    const isPlaceholder = !process.env.STRIPE_SECRET_KEY || 
                          process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder' || 
                          process.env.STRIPE_SECRET_KEY.includes('placeholder');
                           
    if (isPlaceholder) {
      return res.status(400).json({ error: 'Stripe is running in mock mode. Please use a mock session ID to test downloads.' });
    }

    try {
      let session;
      if (sessionId.startsWith('pi_')) {
        const sessions = await stripe.checkout.sessions.list({
          payment_intent: sessionId,
          limit: 1
        });
        if (sessions.data && sessions.data.length > 0) {
          session = await stripe.checkout.sessions.retrieve(sessions.data[0].id, {
            expand: ['line_items']
          });
        }
      } else {
        session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ['line_items']
        });
      }

      if (session && session.payment_status === 'paid') {
        // Find which product was purchased
        const items = session.line_items?.data || [];
        
        // Check line items for products
        const purchaseLaunchKit = items.some(item => 
          item.description?.toLowerCase().includes('launch kit') || 
          item.description?.toLowerCase().includes('odysseus') ||
          item.price?.product === 'prod_UfgbRXariltiyY'
        );
        
        const purchaseHardenedStack = items.some(item => 
          item.description?.toLowerCase().includes('hardened stack') || 
          item.description?.toLowerCase().includes('production-ready')
        );

        if (purchaseLaunchKit) {
          hasPurchased = true;
          targetFile = 'toolkit.zip';
          fileNameToDownload = 'odysseus-launch-kit.zip';
        } else if (purchaseHardenedStack) {
          hasPurchased = true;
          targetFile = 'hardened-stack.zip';
          fileNameToDownload = 'hardened-stack.zip';
        }
      }
    } catch (error) {
      console.error("Stripe Session Retrieval Error during download:", error);
      return res.status(500).json({ error: 'Failed to verify payment session with Stripe.' });
    }
  }

  if (!hasPurchased || !targetFile) {
    return res.status(403).json({ error: 'Unauthorized: Payment not verified for this session.' });
  }

  // Serve the file securely from the apps/api/downloads folder
  const secureDownloadsDir = path.join(__dirname, '..', '..', 'downloads');
  const filePath = path.join(secureDownloadsDir, targetFile);

  if (!fs.existsSync(filePath)) {
    console.error(`Requested file not found in secure storage: ${filePath}`);
    return res.status(404).json({ error: 'Requested download file is not available on the server. Please contact support.' });
  }

  res.download(filePath, fileNameToDownload, (err) => {
    if (err) {
      console.error("Error during secure file download stream:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error occurred while transferring the file.' });
      }
    }
  });
});

export default router;
