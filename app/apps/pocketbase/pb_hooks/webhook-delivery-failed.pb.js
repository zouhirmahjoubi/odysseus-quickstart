/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  if (e.record.get("status") === "failed") {
    const webhookId = e.record.get("webhook_id");
    const webhook = $app.findRecordById("webhooks", webhookId);
    const userId = webhook.get("user_id");
    const user = $app.findRecordById("users", userId);
    
    const eventType = e.record.get("event_type");
    const responseCode = e.record.get("response_code");
    const responseBody = e.record.get("response_body");
    
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: user.get("email") }],
      subject: "Webhook Delivery Failed: " + webhook.get("name"),
      html: "<h2>Webhook Delivery Failed</h2><p><strong>Webhook:</strong> " + webhook.get("name") + "</p><p><strong>Event Type:</strong> " + eventType + "</p><p><strong>Response Code:</strong> " + responseCode + "</p><p><strong>Error Details:</strong></p><pre>" + responseBody + "</pre><p><a href='https://yourapp.com/webhooks/" + webhookId + "/logs'>View Webhook Logs</a></p>"
    });
    $app.newMailClient().send(message);
  }
  e.next();
}, "webhook_logs");