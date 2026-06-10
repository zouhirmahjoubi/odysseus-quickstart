/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const categoriesCollection = app.findCollectionByNameOrId("categories");
  const collection = app.findCollectionByNameOrId("products");

  const existing = collection.fields.getByName("category");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("category"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "category",
    required: true,
    collectionId: categoriesCollection.id
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("products");
    collection.fields.removeByName("category");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
