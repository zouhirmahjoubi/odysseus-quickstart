/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("blog_posts");
  const field = collection.fields.getByName("content");
  field.max = 50000;
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("blog_posts");
  const field = collection.fields.getByName("content");
  if (!field) { console.log("Field not found, skipping revert"); return; }
  field.max = 0;
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection or field not found, skipping revert");
      return;
    }
    throw e;
  }
})
