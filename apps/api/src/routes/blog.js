import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /blog/posts/:id/view - Increment view count for blog post
router.post('/posts/:id/view', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Post ID is required' });
  }

  // Fetch current post
  const post = await pb.collection('blog_posts').getOne(id);

  if (!post) {
    throw new Error(`Blog post ${id} not found`);
  }

  // Increment view count
  const currentViewCount = post.view_count || 0;
  const newViewCount = currentViewCount + 1;

  // Update post with new view count
  const updatedPost = await pb.collection('blog_posts').update(id, {
    view_count: newViewCount,
  });

  logger.info(`Blog post view incremented: id=${id}, view_count=${newViewCount}`);

  res.json({
    success: true,
    postId: updatedPost.id,
    viewCount: updatedPost.view_count,
    title: updatedPost.title,
  });
});

export default router;
