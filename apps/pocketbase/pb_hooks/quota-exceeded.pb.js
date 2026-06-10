/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const userId = e.record.get("user_id");
  const user = $app.findRecordById("users", userId);
  const quota = $app.findFirstRecordByData("quotas", "user_id", userId);
  
  if (quota) {
    const storageQuota = quota.get("storage_quota") || 0;
    const apiCallsQuota = quota.get("api_calls_quota") || 0;
    const testRunsQuota = quota.get("test_runs_quota") || 0;
    const agentInstallationsQuota = quota.get("agent_installations_quota") || 0;
    const teamMembersQuota = quota.get("team_members_quota") || 0;
    
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: user.get("email") }],
      subject: "Quota Limit Exceeded",
      html: "<h2>Quota Limit Exceeded</h2><p>You have exceeded one or more of your quota limits.</p><p><strong>Your Quotas:</strong></p><ul><li>Storage: " + storageQuota + " GB</li><li>API Calls: " + apiCallsQuota + "</li><li>Test Runs: " + testRunsQuota + "</li><li>Agent Installations: " + agentInstallationsQuota + "</li><li>Team Members: " + teamMembersQuota + "</li></ul><p><a href='https://yourapp.com/upgrade'>Upgrade Your Plan</a></p>"
    });
    $app.newMailClient().send(message);
  }
  e.next();
}, "quotas");