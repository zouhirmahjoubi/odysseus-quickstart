import 'dotenv/config';
import logger from './logger.js';

/**
 * Email templates for different notification types
 */
const emailTemplates = {
  order_confirmation: (orderData) => {
    const isDigital = orderData.downloadUrl || orderData.isDigital;
    return {
      subject: `Order Confirmation - Order #${orderData.orderId}`,
      html: `
        <h2>Order Confirmation</h2>
        <p>Thank you for your order!</p>
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p><strong>Amount:</strong> $${orderData.amount?.toFixed(2) || 'N/A'}</p>
        <p><strong>Status:</strong> ${orderData.status || 'Processing'}</p>
        
        ${isDigital ? `
          <div style="background-color: #f8fafc; padding: 20px; border: 2px solid #e2e8f0; margin: 20px 0; border-radius: 8px; font-family: sans-serif;">
            <h3 style="margin-top: 0; color: #0f172a; font-size: 18px; font-weight: 800;">🚀 DIGITAL DOWNLOAD READY</h3>
            <p style="color: #475569; font-size: 14px; margin-bottom: 16px;">Your digital product files are verified and ready for download. Access them immediately using the secure link below:</p>
            <a href="${orderData.downloadUrl || '#'}" style="display: inline-block; background-color: #ff9000; color: #000000; font-weight: 900; padding: 12px 24px; text-decoration: none; border-radius: 6px; border: 2px solid #000000; box-shadow: 3px 3px 0px 0px #000000;">
              DOWNLOAD YOUR FILES
            </a>
          </div>
        ` : ''}

        ${orderData.shippingAddress && !isDigital ? `
          <h3>Shipping Address</h3>
          <p>${orderData.shippingAddress.street || ''}<br/>
          ${orderData.shippingAddress.city || ''}, ${orderData.shippingAddress.state || ''} ${orderData.shippingAddress.zipCode || ''}<br/>
          ${orderData.shippingAddress.country || ''}</p>
          <p>We'll send you a tracking number once your order ships.</p>
        ` : ''}
        
        <p>If you have any questions, reply to this email or contact support.</p>
      `,
    };
  },
  payment_receipt: (orderData) => ({
    subject: `Payment Receipt - Order #${orderData.orderId}`,
    html: `
      <h2>Payment Receipt</h2>
      <p><strong>Order ID:</strong> ${orderData.orderId}</p>
      <p><strong>Status:</strong> ${orderData.status || 'Processing'}</p>
      ${orderData.failureReason ? `<p style="color: red;"><strong>Failure Reason:</strong> ${orderData.failureReason}</p>` : ''}
      ${orderData.refundId ? `<p style="color: green;"><strong>Refund ID:</strong> ${orderData.refundId}</p>` : ''}
    `,
  }),
  shipping_notification: (orderData) => ({
    subject: `Your Order Has Shipped - Order #${orderData.orderId}`,
    html: `
      <h2>Shipping Notification</h2>
      <p>Your order has been shipped!</p>
      <p><strong>Order ID:</strong> ${orderData.orderId}</p>
      ${orderData.trackingNumber ? `<p><strong>Tracking Number:</strong> ${orderData.trackingNumber}</p>` : ''}
      <p>You can track your package using the tracking number above.</p>
    `,
  }),
  delivery_confirmation: (orderData) => ({
    subject: `Your Order Has Been Delivered - Order #${orderData.orderId}`,
    html: `
      <h2>Delivery Confirmation</h2>
      <p>Your order has been delivered!</p>
      <p><strong>Order ID:</strong> ${orderData.orderId}</p>
      <p>Thank you for your purchase. We hope you enjoy your items!</p>
    `,
  }),
};

/**
 * Send email notification
 * @param {Object} params - Email parameters
 * @param {string} params.type - Email type (order_confirmation, payment_receipt, shipping_notification, delivery_confirmation)
 * @param {string} params.orderId - Order ID
 * @param {string} params.customerEmail - Customer email address
 * @param {Object} params.orderData - Order data for template
 * @returns {Promise<Object>} - Result with messageId
 */
export async function sendEmail({ type, orderId, customerEmail, orderData }) {
  // Validate inputs
  if (!type || !orderId || !customerEmail || !orderData) {
    throw new Error('Missing required email parameters');
  }

  // Get email template
  const templateFn = emailTemplates[type];
  if (!templateFn) {
    throw new Error(`Unknown email type: ${type}`);
  }

  const emailContent = templateFn(orderData);

  // Log email (in production, integrate with actual email service)
  logger.info(`Email queued: type=${type}, to=${customerEmail}, subject="${emailContent.subject}"`);

  // TODO: Integrate with actual email service (nodemailer, SendGrid, AWS SES, etc.)
  // For now, return a mock response
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    messageId,
    type,
    to: customerEmail,
    subject: emailContent.subject,
  };
}

export default sendEmail;