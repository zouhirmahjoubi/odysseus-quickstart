
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import pb from '@/lib/pocketbaseClient.js';

const BlogCard = ({ title, category, description, author, date, slug, imageRecord }) => {
  const formattedDate = date ? format(new Date(date), 'MMM dd, yyyy') : '';
  
  // Safe helper to assign cute emojis based on SEO content category
  const getCategoryEmoji = (cat) => {
    if (!cat) return '📝';
    const c = cat.toLowerCase();
    if (c.includes('install')) return '🚀';
    if (c.includes('model') || c.includes('llm')) return '🧠';
    if (c.includes('gpu') || c.includes('tune') || c.includes('tuning')) return '⚡';
    if (c.includes('hardware')) return '🖥️';
    if (c.includes('agent')) return '🤖';
    if (c.includes('db') || c.includes('data')) return '📦';
    return '📝';
  };

  // Handle image URL generation safely
  const getImageUrl = () => {
    try {
      if (imageRecord && imageRecord.featured_image) {
        return pb.files.getUrl(imageRecord, imageRecord.featured_image);
      }
    } catch (e) {
      console.error("Error generating image URL for blog card", e);
    }
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <Link 
      to={`/blog/${slug}`} 
      className="block group h-full focus:outline-none"
    >
      <div className="bg-[hsl(var(--light-blue))] border-4 border-black rounded-lg h-full flex flex-col transition-all duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-focus-visible:-translate-y-1 group-focus-visible:-translate-x-1 group-focus-visible:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden cute-wiggle-hover">
        
        {/* Image Area */}
        {imageUrl ? (
          <div className="h-48 border-b-4 border-black overflow-hidden bg-muted">
             <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
          </div>
        ) : (
          <div className="bg-primary/20 h-48 border-b-4 border-black flex items-center justify-center relative overflow-hidden">
            <BookOpen className="w-16 h-16 text-primary/60 opacity-50 transform group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
          </div>
        )}

        <div className="p-5 md:p-6 flex flex-col flex-grow">
          {/* Category Badge */}
          <div className="mb-4 self-start">
            <span className="bg-[hsl(var(--badge-green))] text-white border-2 border-black rounded font-black uppercase text-[10px] tracking-widest px-2.5 py-1 inline-block transition-transform duration-200 group-hover:scale-105">
              {getCategoryEmoji(category)} {category || 'Engineering'}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-black text-black leading-tight mb-3 line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground font-medium text-sm md:text-base line-clamp-3 mb-6 flex-grow">
            {description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-black/10 mt-auto">
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase text-black">{author || 'Admin'}</span>
              <span className="text-xs font-medium text-muted-foreground">{formattedDate}</span>
            </div>
            
            {/* Read More Button */}
            <div className="w-10 h-10 bg-accent rounded-lg border-2 border-black flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ArrowRight className="w-5 h-5 text-black transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default BlogCard;
