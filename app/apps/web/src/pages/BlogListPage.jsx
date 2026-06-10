
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, BookOpen, AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { Skeleton } from '@/components/ui/skeleton';
import BlogCard from '@/components/BlogCard.jsx';

const BlogListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchPublishedPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Query blog_posts collection for published articles
      const result = await pb.collection('blog_posts').getList(1, 50, { 
        filter: 'status="published"',
        sort: '-publication_date,-created',
        expand: 'category,tags',
        $autoCancel: false 
      });
      setPosts(result.items);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err.message || "Failed to load transmissions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedPosts();
  }, []);

  const filteredPosts = posts.filter(p => 
    (p.title && p.title.toLowerCase().includes(search.toLowerCase())) || 
    (p.excerpt && p.excerpt.toLowerCase().includes(search.toLowerCase())) ||
    (p.expand?.category && p.expand.category.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto pb-24 pt-6 md:pt-12 px-4 sm:px-6 space-y-12">
      <Helmet>
        <title>Engineering Blog | OdysseusAI</title>
      </Helmet>

      <div className="neo-card bg-card p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="inline-block bg-primary text-primary-foreground border-4 border-border px-4 py-1 font-black uppercase tracking-widest mb-6 shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))] rounded-md text-sm">
            Knowledge Base
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-6 text-balance">
            Engineering <span className="text-primary block sm:inline">Transmissions</span>
          </h1>
          <p className="text-lg md:text-xl font-bold text-muted-foreground leading-relaxed text-balance">
            Deep dives into enterprise LLM architectures, local deployment strategies, and autonomous agent frameworks.
          </p>
        </div>
        <div className="w-full md:w-auto flex-shrink-0">
          <BookOpen size={120} strokeWidth={1} className="text-primary hidden md:block opacity-80" />
        </div>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" strokeWidth={3} />
        <input 
          type="text" 
          placeholder="Search transmissions..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="neo-input pl-14 py-4 text-lg w-full font-bold"
        />
      </div>

      {error ? (
        <div className="neo-card bg-destructive/10 border-destructive p-8 text-center flex flex-col items-center">
          <AlertCircle size={48} className="text-destructive mb-4" strokeWidth={2} />
          <h3 className="text-2xl font-black uppercase mb-2 text-destructive">Connection Error</h3>
          <p className="font-bold text-destructive/80 mb-6">{error}</p>
          <button onClick={fetchPublishedPosts} className="neo-button bg-card">Retry Connection</button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="neo-card p-6 space-y-4">
              <Skeleton className="h-48 w-full rounded-md bg-muted" />
              <Skeleton className="h-6 w-3/4 bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-5/6 bg-muted" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="neo-card bg-card p-16 text-center flex flex-col items-center justify-center">
          <BookOpen size={64} className="text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-2xl font-black uppercase mb-4 text-muted-foreground">No transmissions found</h3>
          <p className="font-bold text-muted-foreground/80">Adjust your search parameters and try again.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <BlogCard
              key={post.id}
              title={post.title}
              category={post.expand?.category?.name || 'Uncategorized'}
              description={post.excerpt || post.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
              author={post.author}
              date={post.publication_date || post.created}
              slug={post.slug}
              imageRecord={post}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogListPage;
