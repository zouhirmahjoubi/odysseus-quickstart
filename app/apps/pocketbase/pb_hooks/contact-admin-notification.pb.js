/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const adminEmail = $app.settings().meta.adminEmail || "admin@example.com";
  const name = e.record.get("name");
  const email = e.record.get("email");
  const phone = e.record.get("phone") || "Not provided";
  const subject = e.record.get("subject");
  const message_text = e.record.get("message");
  const referenceNumber = e.record.id;
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: adminEmail }],
    subject: "New Contact Form Submission - " + subject,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Reference Number:</strong> ${referenceNumber}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message_text.replace(/\n/g, "<br>")}</p>
      <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #666;">
        <a href="https://yoursite.com/admin/contact-submissions/${referenceNumber}">View in Admin Panel</a>
      </p>
    `
  });
  
  $app.newMailClient().send(message);
  e.next();
}, "contact_submissions");