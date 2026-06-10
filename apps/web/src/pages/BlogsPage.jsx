
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PageTransition from '@/components/PageTransition.jsx';
import NeoBrutalCard from '@/components/NeoBrutalCard.jsx';
import { getStoredPosts } from '@/utils/storage.js';

const BlogsPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const allPosts = getStoredPosts();
    const publishedPosts = allPosts
      .filter(post => post.status === 'published')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setPosts(publishedPosts);
  }, []);

  return (
    <PageTransition>
      <Helmet>
        <title>Deep Tutorials - OdysseusAI</title>
      </Helmet>

      <div className="min-h-[calc(100vh-60px)] py-[20px] md:py-[60px] px-[15px] md:px-[40px] w-full">
        <div className="max-w-[1000px] mx-auto w-full">
          <header className="mb-[30px] md:mb-[60px] w-full">
            <h1 className="space-grotesk text-[32px] md:text-[48px] font-bold text-[hsl(var(--foreground))] leading-tight mb-[10px] md:mb-[15px]">
              Deep Tutorials & Insights
            </h1>
            <p className="text-[16px] md:text-[18px] text-[hsl(var(--muted-foreground))] leading-[1.6]">
              Explore our latest articles, guides, and technical deep dives.
            </p>
          </header>

          {posts.length === 0 ? (
            <NeoBrutalCard className="text-center py-[40px]">
              <p className="text-[16px] md:text-[18px] font-bold space-grotesk text-[hsl(var(--muted-foreground))]">No blog posts yet. Check back soon!</p>
            </NeoBrutalCard>
          ) : (
            <div className="flex flex-col gap-[20px] md:gap-[40px] w-full">
              {posts.map(post => (
                <NeoBrutalCard key={post.id} className="w-full">
                  <div className="flex flex-wrap gap-[8px] md:gap-[10px] mb-[15px] md:mb-[20px] w-full">
                    {post.tags && post.tags.map((tag, i) => (
                      <span key={i} className="bg-[hsl(var(--sidebar))] text-black border-[2px] border-black px-[10px] py-[4px] text-[10px] md:text-[12px] font-bold space-grotesk whitespace-nowrap">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="space-grotesk text-[24px] md:text-[32px] font-bold mb-[10px] md:mb-[15px] leading-tight w-full break-words">
                    {post.title}
                  </h2>
                  <p className="text-[12px] md:text-[14px] text-[hsl(var(--muted-foreground))] font-bold mb-[15px] md:mb-[20px]">
                    Published on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <div className="text-[14px] md:text-[16px] leading-[1.8] whitespace-pre-wrap break-words w-full">
                    {post.content}
                  </div>
                </NeoBrutalCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default BlogsPage;
