/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const email = e.record.get("email");
  const name = e.record.get("name");
  const referenceNumber = e.record.id;
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: email }],
    subject: "We Received Your Message - Reference #" + referenceNumber,
    html: `
      <h1>Thank You for Contacting Us!</h1>
      <p>Hi ${name},</p>
      <p>We have received your message and appreciate you reaching out to us. Our team will review your submission and get back to you as soon as possible.</p>
      <p><strong>Reference Number:</strong> ${referenceNumber}</p>
      <p>If you have any urgent matters, please feel free to call us directly.</p>
      <p>Best regards,<br>Our Team</p>
    `
  });
  
  $app.newMailClient().send(message);
  e.next();
}, "contact_submissions");