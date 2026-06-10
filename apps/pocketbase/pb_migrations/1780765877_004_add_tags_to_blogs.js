/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const pbc_2534298525Collection = app.findCollectionByNameOrId("pbc_2534298525");
  const collection = app.findCollectionByNameOrId("blogs");

  const existing = collection.fields.getByName("tags");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("tags"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "tags",
    collectionId: pbc_2534298525Collection.id,
    maxSelect: 999
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("blogs");
    collection.fields.removeByName("tags");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
