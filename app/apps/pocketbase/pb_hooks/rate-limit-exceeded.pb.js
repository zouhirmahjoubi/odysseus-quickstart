/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const userId = e.record.get("user_id");
  const user = $app.findRecordById("users", userId);
  const rateLimit = $app.findFirstRecordByData("rate_limits", "user_id", userId);
  
  if (rateLimit) {
    const requestsPerMinute = rateLimit.get("requests_per_minute") || 0;
    const requestsPerHour = rateLimit.get("requests_per_hour") || 0;
    const requestsPerDay = rateLimit.get("requests_per_day") || 0;
    
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: user.get("email") }],
      subject: "Rate Limit Exceeded",
      html: "<h2>Rate Limit Exceeded</h2><p>You have exceeded your rate limits.</p><p><strong>Current Limits:</strong></p><ul><li>Requests per minute: " + requestsPerMinute + "</li><li>Requests per hour: " + requestsPerHour + "</li><li>Requests per day: " + requestsPerDay + "</li></ul><p>Your limits will reset at the start of the next period.</p><p><a href='https://yourapp.com/upgrade'>Upgrade Your Plan</a></p>"
    });
    $app.newMailClient().send(message);
  }
  e.next();
}, "rate_limits");