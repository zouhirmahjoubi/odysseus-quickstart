/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("blog_tags");
  collection.indexes.push("CREATE UNIQUE INDEX idx_blog_tags_slug ON blog_tags (slug)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("blog_tags");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_blog_tags_slug"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
