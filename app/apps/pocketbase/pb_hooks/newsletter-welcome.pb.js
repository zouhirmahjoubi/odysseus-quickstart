/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const email = e.record.get("email");
  const unsubscribeLink = "https://yoursite.com/unsubscribe?token=" + (e.record.get("confirmation_token") || e.record.id);
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: email }],
    subject: "Welcome to Our Newsletter!",
    html: `
      <h1>Welcome!</h1>
      <p>Thank you for subscribing to our newsletter. We're excited to have you on board!</p>
      <p>You'll receive updates about our latest products, features, and news directly in your inbox.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #666;">
        <a href="${unsubscribeLink}" style="color: #0066cc;">Unsubscribe from this newsletter</a>
      </p>
    `
  });
  
  $app.newMailClient().send(message);
  e.next();
}, "newsletter_subscribers");