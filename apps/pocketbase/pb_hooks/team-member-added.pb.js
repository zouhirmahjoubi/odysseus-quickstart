/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const teamId = e.record.get("team_id");
  const team = $app.findRecordById("teams", teamId);
  const userId = e.record.get("user_id");
  const user = $app.findRecordById("users", userId);
  const role = e.record.get("role");
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: user.get("email") }],
    subject: "You've been added to " + team.get("name"),
    html: "<h2>Welcome to the Team</h2><p>Hi " + user.get("name") + ",</p><p>You have been added to the team <strong>" + team.get("name") + "</strong> with the role of <strong>" + role + "</strong>.</p><p><strong>Team Description:</strong></p><p>" + (team.get("description") || "No description provided") + "</p><p><a href='https://yourapp.com/teams/" + teamId + "'>View Team</a></p>"
  });
  $app.newMailClient().send(message);
  e.next();
}, "team_members");