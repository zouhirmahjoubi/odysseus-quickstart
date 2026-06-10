/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const teamId = e.record.get("team_id");
  const team = $app.findRecordById("teams", teamId);
  const inviteeEmail = e.record.get("email");
  const inviteToken = e.record.get("token");
  const ownerId = team.get("owner_id");
  const owner = $app.findRecordById("users", ownerId);
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: inviteeEmail }],
    subject: "You're invited to join " + team.get("name"),
    html: "<h2>Team Invitation</h2><p>Hi,</p><p>" + owner.get("name") + " has invited you to join the team <strong>" + team.get("name") + "</strong>.</p><p><a href='https://yourapp.com/accept-invite/" + inviteToken + "'>Accept Invitation</a></p><p>If you did not expect this invitation, you can ignore this email.</p>"
  });
  $app.newMailClient().send(message);
  e.next();
}, "team_invites");