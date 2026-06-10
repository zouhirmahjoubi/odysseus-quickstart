
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { ArrowLeft, Calendar, User, Tag, AlertCircle, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Fetch by slug from blog_posts
        const record = await pb.collection('blog_posts').getFirstListItem(`slug="${slug}"`, {
          expand: 'category,tags',
          $autoCancel: false
        });
        
        // Ensure post is published
        if (record.status !== 'published' && !pb.authStore.isValid) {
          throw new Error('Not found or unauthorized');
        }

        setBlog(record);

        // Increment view count
        try {
          await pb.collection('blog_posts').update(record.id, {
            view_count: (record.view_count || 0) + 1
          }, { $autoCancel: false });
        } catch (updateErr) {
          console.error("Failed to increment view count", updateErr);
        }

      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchBlog();
    } else {
      setError(true);
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pb-24 pt-12 px-4 space-y-8 w-full">
        <Skeleton className="h-12 w-48 bg-muted rounded-md" />
        <div className="neo-card p-8 md:p-16 space-y-8 bg-card">
          <Skeleton className="h-8 w-32 bg-muted rounded-md" />
          <Skeleton className="h-16 w-full bg-muted rounded-md" />
          <Skeleton className="h-6 w-64 bg-muted rounded-md" />
          <Skeleton className="h-[400px] w-full bg-muted rounded-md" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto pb-24 pt-24 px-4 text-center w-full">
        <Helmet><title>Post Not Found | OdysseusAI</title></Helmet>
        <div className="neo-card bg-card p-16 flex flex-col items-center">
          <AlertCircle size={64} className="text-destructive mb-6" strokeWidth={2} />
          <h1 className="text-4xl font-black uppercase mb-4 text-balance">Transmission Not Found</h1>
          <p className="text-xl font-bold text-muted-foreground mb-8 text-balance">The blog post you are looking for does not exist or has been removed.</p>
          <Link to="/blog" className="neo-button bg-primary text-primary-foreground">
            Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = blog.featured_image ? pb.files.getUrl(blog, blog.featured_image) : null;
  const publishDate = blog.publication_date || blog.created;
  const categoryName = blog.expand?.category?.name || 'Engineering';
  const tagNames = blog.expand?.tags?.map(t => t.name).join(', ');

  return (
    <div className="max-w-4xl mx-auto pb-24 pt-12 px-4 w-full">
      <Helmet>
        <title>{`${blog.title} | OdysseusAI`}</title>
        {blog.excerpt && <meta name="description" content={blog.excerpt} />}
      </Helmet>

      <Link 
        to="/blog" 
        className="inline-flex items-center gap-2 font-black uppercase mb-8 hover:text-primary transition-colors text-sm tracking-wider"
      >
        <ArrowLeft size={20} strokeWidth={3} /> Back to Transmissions
      </Link>

      <article className="neo-card bg-card p-6 md:p-12 lg:p-16">
        <header className="mb-12 border-b-4 border-border pb-12">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-primary text-primary-foreground border-4 border-border px-4 py-1 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))] text-xs md:text-sm">
              {categoryName}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight mb-8 text-balance">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 font-bold text-muted-foreground text-sm md:text-base uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <User size={18} strokeWidth={3} className="text-foreground" />
              <span>{blog.author || 'Odysseus Team'}</span>
            </div>
            {publishDate && (
              <div className="flex items-center gap-2">
                <Calendar size={18} strokeWidth={3} className="text-foreground" />
                <span>{new Date(publishDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
            {blog.read_time > 0 && (
              <div className="flex items-center gap-2">
                <Clock size={18} strokeWidth={3} className="text-foreground" />
                <span>{blog.read_time} Min Read</span>
              </div>
            )}
            {tagNames && (
              <div className="flex items-center gap-2 text-primary">
                <Tag size={18} strokeWidth={3} />
                <span>{tagNames}</span>
              </div>
            )}
          </div>
        </header>

        {imageUrl && (
          <div className="mb-12 border-4 border-border rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_hsl(var(--shadow-color))] bg-muted">
            <img 
              src={imageUrl} 
              alt={blog.title} 
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none 
            prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-foreground
            prose-p:text-foreground prose-p:leading-relaxed prose-p:font-medium
            prose-a:text-primary prose-a:font-black prose-a:no-underline hover:prose-a:underline hover:prose-a:decoration-4
            prose-strong:font-black prose-strong:text-foreground
            prose-blockquote:border-l-8 prose-blockquote:border-primary prose-blockquote:bg-muted prose-blockquote:p-6 prose-blockquote:text-foreground prose-blockquote:font-black prose-blockquote:not-italic prose-blockquote:shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))] prose-blockquote:border-y-4 prose-blockquote:border-r-4
            prose-code:font-mono prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:border-4 prose-code:border-border prose-code:font-bold prose-code:text-foreground
            prose-pre:bg-[#111111] prose-pre:border-4 prose-pre:border-border prose-pre:shadow-[8px_8px_0px_0px_hsl(var(--shadow-color))] prose-pre:text-[#00FF00] prose-pre:font-mono
            prose-li:text-foreground prose-li:font-medium
          "
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </div>
  );
};

export default BlogDetailPage;
