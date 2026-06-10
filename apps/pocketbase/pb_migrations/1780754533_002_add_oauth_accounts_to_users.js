/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const oauth_accountsCollection = app.findCollectionByNameOrId("oauth_accounts");
  const collection = app.findCollectionByNameOrId("users");

  const existing = collection.fields.getByName("oauth_accounts");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("oauth_accounts"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "oauth_accounts",
    collectionId: oauth_accountsCollection.id,
    maxSelect: 3
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("users");
    collection.fields.removeByName("oauth_accounts");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
