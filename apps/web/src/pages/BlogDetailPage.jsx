import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { ArrowLeft, Calendar, User, Tag, AlertCircle, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { fallbackBlogs } from '@/data/fallbackBlogs.js';

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

        // Check if this matches a fallback static post first
        const fallbackPost = fallbackBlogs.find(item => item.slug === slug);
        if (fallbackPost) {
          setBlog(fallbackPost);
          setLoading(false);
          return;
        }
        
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

  useEffect(() => {
    if (blog && !loading) {
      const tables = document.querySelectorAll('.blog-content-rich table');
      tables.forEach(table => {
        if (table.parentNode && table.parentNode.className !== 'table-responsive-wrapper') {
          const wrapper = document.createElement('div');
          wrapper.className = 'table-responsive-wrapper overflow-x-auto rounded-xl border border-white/10 my-6 w-full';
          table.parentNode.insertBefore(wrapper, table);
          wrapper.appendChild(table);
        }
      });
    }
  }, [blog, loading]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pb-24 pt-12 px-4 space-y-8 w-full">
        <Skeleton className="h-12 w-48 bg-white/5 rounded-md" />
        <div className="border border-white/10 p-8 md:p-16 space-y-8 bg-white/5 rounded-2xl">
          <Skeleton className="h-8 w-32 bg-white/5 rounded-md" />
          <Skeleton className="h-16 w-full bg-white/5 rounded-md" />
          <Skeleton className="h-6 w-64 bg-white/5 rounded-md" />
          <Skeleton className="h-[400px] w-full bg-white/5 rounded-md" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto pb-24 pt-24 px-4 text-center w-full">
        <Helmet><title>Post Not Found | OdysseusAI</title></Helmet>
        <div className="bg-white/5 border border-white/10 p-16 flex flex-col items-center rounded-2xl">
          <AlertCircle size={64} className="text-[#E73A5A] mb-6" strokeWidth={2} />
          <h1 className="text-4xl font-black uppercase mb-4 text-balance text-white">Transmission Not Found</h1>
          <p className="text-xl font-bold text-white/60 mb-8 text-balance">The blog post you are looking for does not exist or has been removed.</p>
          <Link to="/odysseus-blog" className="bg-[#E73A5A] hover:bg-[#E73A5A]/90 text-white font-black px-6 py-3 rounded-xl border border-white/10 transition-colors">
            Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  const getImageUrl = () => {
    if (!blog) return null;
    if (blog.featured_image) {
      if (blog.featured_image.startsWith('http') || blog.featured_image.startsWith('/')) {
        return blog.featured_image;
      }
      return pb.files.getUrl(blog, blog.featured_image);
    }
    return null;
  };

  const imageUrl = getImageUrl();
  const publishDate = blog.publication_date || blog.created;
  const categoryName = blog.expand?.category?.name || blog.category || 'Engineering';
  const tagNames = blog.expand?.tags?.map(t => t.name).join(', ') || (blog.tags ? blog.tags.join(', ') : '');

  return (
    <div className="max-w-4xl mx-auto pb-24 pt-12 px-4 w-full text-left">
      <Helmet>
        <title>{`${blog.title} | OdysseusAI`}</title>
        {blog.excerpt && <meta name="description" content={blog.excerpt} />}
      </Helmet>

      <Link 
        to="/odysseus-blog" 
        className="inline-flex items-center gap-2 font-black uppercase mb-8 text-[#E73A5A] dark:text-white/60 hover:opacity-80 transition-opacity text-sm tracking-wider"
      >
        <ArrowLeft size={20} strokeWidth={3} /> Back to Transmissions
      </Link>

      <article className="checkout-card p-6 md:p-12 lg:p-16 rounded-3xl transition-all duration-300">
        <header className="mb-12 border-b border-gray-200 dark:border-white/10 pb-12">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-[#E73A5A]/10 text-[#E73A5A] border border-[#E73A5A]/20 px-4 py-1 font-black uppercase tracking-widest text-xs md:text-sm rounded">
              {categoryName}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight mb-8 text-balance text-white text-left">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 font-bold text-white/50 text-sm md:text-base uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <User size={18} strokeWidth={3} className="text-white" />
              <span>{blog.author || 'Odysseus Team'}</span>
            </div>
            {publishDate && (
              <div className="flex items-center gap-2">
                <Calendar size={18} strokeWidth={3} className="text-white" />
                <span>{new Date(publishDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
            {blog.read_time > 0 && (
              <div className="flex items-center gap-2">
                <Clock size={18} strokeWidth={3} className="text-white" />
                <span>{blog.read_time} Min Read</span>
              </div>
            )}
            {tagNames && (
              <div className="flex items-center gap-2 text-[#E73A5A]">
                <Tag size={18} strokeWidth={3} />
                <span>{tagNames}</span>
              </div>
            )}
          </div>
        </header>

        {imageUrl && (
          <div className="mb-12 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
            <img 
              src={imageUrl} 
              alt={blog.title} 
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        <div 
          className="blog-content-rich w-full"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </div>
  );
};

export default BlogDetailPage;
