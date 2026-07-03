
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import pb from '@/lib/pocketbaseClient.js';

const FeaturedArticlesSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const records = await pb.collection('blog_posts').getList(1, 4, {
          filter: 'status="published"',
          sort: '-publication_date',
          expand: 'category',
          $autoCancel: false
        });
        setPosts(records.items);
      } catch (error) {
        console.error('Error fetching featured posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-12 animate-pulse">
        <div className="h-10 bg-gray-200 w-64 mb-8 neo-border"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[500px] bg-gray-200 neo-border"></div>
          <div className="flex flex-col gap-8">
            <div className="h-[234px] bg-gray-200 neo-border"></div>
            <div className="h-[234px] bg-gray-200 neo-border"></div>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  const featuredPost = posts[0];
  const sidePosts = posts.slice(1);

  return (
    <section className="py-12 w-full">
      <div className="flex justify-between items-end mb-8 border-b-[3px] border-black pb-4">
        <h2 className="text-3xl md:text-4xl font-black space-grotesk">Latest Insights</h2>
        <Link to="/odysseus-blog" className="hidden md:flex items-center font-bold hover:text-[hsl(var(--primary))] transition-colors">
          View All Articles <ArrowRight size={20} className="ml-2" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Featured Post */}
        <div className="lg:col-span-2">
          <Link to={`/odysseus-blog/${featuredPost.slug}`} className="group block h-full">
            <div className="neo-blog-card h-full">
              <div className="w-full aspect-video md:aspect-[2/1] bg-[var(--accent-sky)] border-b-[3px] border-black overflow-hidden relative">
                {featuredPost.featured_image ? (
                  <img 
                    src={pb.files.getUrl(featuredPost, featuredPost.featured_image)} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-4xl opacity-20">
                    OdysseusAI
                  </div>
                )}
                {featuredPost.expand?.category && (
                  <div className="absolute top-4 left-4 bg-[var(--accent-mint)] text-black px-3 py-1 font-bold text-sm neo-border">
                    {featuredPost.expand.category.name}
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-sm font-bold text-gray-600 dark:text-gray-400 mb-4">
                  <span className="flex items-center"><Calendar size={16} className="mr-1" /> {format(new Date(featuredPost.publication_date || featuredPost.created), 'MMM d, yyyy')}</span>
                  <span className="flex items-center"><Clock size={16} className="mr-1" /> {featuredPost.read_time || 5} min read</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-black space-grotesk mb-4 group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2">
                  {featuredPost.title}
                </h3>
                <p className="font-medium text-gray-700 dark:text-gray-300 mb-6 line-clamp-3 text-lg">
                  {featuredPost.excerpt || featuredPost.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-bold">By {featuredPost.author}</span>
                  <span className="neo-button bg-black text-white py-2 px-4 text-sm group-hover:bg-[var(--accent-mint)] group-hover:text-black">
                    Read Article
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Side Posts */}
        <div className="flex flex-col gap-8">
          {sidePosts.map(post => (
            <Link key={post.id} to={`/odysseus-blog/${post.slug}`} className="group block h-full">
              <div className="neo-blog-card h-full">
                <div className="w-full h-48 bg-[var(--accent-pale-yellow)] border-b-[3px] border-black overflow-hidden relative">
                  {post.featured_image && (
                    <img 
                      src={pb.files.getUrl(post, post.featured_image)} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-xs font-bold text-[hsl(var(--primary))] mb-2 uppercase tracking-wider">
                    {post.expand?.category?.name || 'Article'}
                  </div>
                  <h4 className="text-xl font-black space-grotesk mb-3 group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="mt-auto flex items-center gap-3 text-xs font-bold text-gray-500">
                    <span>{format(new Date(post.publication_date || post.created), 'MMM d, yyyy')}</span>
                    <span>•</span>
                    <span>{post.read_time || 5} min read</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="mt-8 md:hidden">
        <Link to="/odysseus-blog" className="neo-button w-full bg-white text-black">
          View All Articles <ArrowRight size={20} className="ml-2" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedArticlesSection;
