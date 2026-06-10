/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const admin_usersCollection = app.findCollectionByNameOrId("admin_users");
  const collection = app.findCollectionByNameOrId("blog_posts");

  const existing = collection.fields.getByName("created_by");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("created_by"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "created_by",
    required: true,
    collectionId: admin_usersCollection.id,
    maxSelect: 1
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("blog_posts");
    collection.fields.removeByName("created_by");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
