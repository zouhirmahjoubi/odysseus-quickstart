/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("blogs");

  const record0 = new Record(collection);
    record0.set("title", "Welcome to Odysseusai.ai Blog");
    record0.set("slug", "welcome-to-odysseusai-blog");
    record0.set("excerpt", "Discover the latest updates and insights from Odysseusai.ai");
    record0.set("featured_image", "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop");
    record0.set("content", "<h2>Welcome to Our Blog</h2><p>This is the first blog post on Odysseusai.ai. We share insights, updates, and best practices for AI and automation.</p><p>Stay tuned for more content!</p>");
    record0.set("category", "Tutorials");
    record0.set("author", "Odysseusai Team");
    record0.set("status", "published");
    record0.set("published", true);
    record0.set("view_count", 0);
    record0.set("read_time", 5);
    record0.set("meta_description", "Welcome to the Odysseusai.ai blog - your source for AI and automation insights");
    record0.set("keywords", "AI, automation, odysseusai");
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})
