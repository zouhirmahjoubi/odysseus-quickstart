/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const teamsCollection = app.findCollectionByNameOrId("teams");
  const collection = app.findCollectionByNameOrId("user_agents");

  const existing = collection.fields.getByName("team_id");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("team_id"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "team_id",
    collectionId: teamsCollection.id
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("user_agents");
    collection.fields.removeByName("team_id");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
