/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("blog_articles");

  const record0 = new Record(collection);
    record0.set("title", "Welcome to OdysseusAI Blog");
    record0.set("slug", "welcome-to-odysseusai-blog");
    record0.set("content", "OdysseusAI is a cutting-edge platform for AI model management and deployment. This blog covers the latest updates, best practices, and insights into working with large language models. Stay tuned for in-depth tutorials, case studies, and industry news.");
    record0.set("excerpt", "Welcome to the OdysseusAI blog - your source for AI insights and updates");
    record0.set("author", "OdysseusAI Team");
    record0.set("category", "News");
    record0.set("tags", "AI,LLM,Technology");
    record0.set("status", "published");
    record0.set("view_count", 0);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("title", "Getting Started with AI Models");
    record1.set("slug", "getting-started-with-ai-models");
    record1.set("content", "Learn the fundamentals of working with AI models. This guide covers model selection, configuration, deployment, and best practices for production environments. Whether you are new to AI or an experienced practitioner, this post provides valuable insights.");
    record1.set("excerpt", "A comprehensive guide to getting started with AI models");
    record1.set("author", "OdysseusAI Team");
    record1.set("category", "Tutorials");
    record1.set("tags", "AI,Getting Started,Guide");
    record1.set("status", "published");
    record1.set("view_count", 0);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("title", "Understanding LLM Parameters");
    record2.set("slug", "understanding-llm-parameters");
    record2.set("content", "Large Language Models have numerous parameters that affect their behavior and performance. This post explores key parameters like temperature, top_p, max_tokens, and frequency_penalty. Understanding these settings is crucial for optimizing model outputs for your specific use case.");
    record2.set("excerpt", "Deep dive into LLM parameters and how they affect model behavior");
    record2.set("author", "OdysseusAI Team");
    record2.set("category", "Technical");
    record2.set("tags", "LLM,Parameters,Advanced");
    record2.set("status", "published");
    record2.set("view_count", 0);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("title", "Best Practices for AI Development");
    record3.set("slug", "best-practices-for-ai-development");
    record3.set("content", "Developing with AI requires careful consideration of ethics, performance, and reliability. This post outlines best practices for prompt engineering, error handling, cost optimization, and responsible AI development. Learn from industry experts and improve your AI applications.");
    record3.set("excerpt", "Essential best practices for building robust AI applications");
    record3.set("author", "OdysseusAI Team");
    record3.set("category", "Best Practices");
    record3.set("tags", "Development,Best Practices,Ethics");
    record3.set("status", "published");
    record3.set("view_count", 0);
  try {
    app.save(record3);
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
