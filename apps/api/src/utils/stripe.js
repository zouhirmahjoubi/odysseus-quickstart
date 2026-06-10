import 'dotenv/config';
import Stripe from 'stripe';

let stripeInstance = null;

export function initializeStripe() {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    stripeInstance = new Stripe(secretKey);
  }
  return stripeInstance;
}

export default initializeStripe;
