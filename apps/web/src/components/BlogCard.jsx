
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
        if (imageRecord.featured_image.startsWith('http') || imageRecord.featured_image.startsWith('/')) {
          return imageRecord.featured_image;
        }
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
      to={`/odysseus-blog/${slug}`} 
      className="block group h-full focus:outline-none"
    >
      <div className="bg-white/5 border border-white/10 rounded-2xl h-full flex flex-col transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[#E73A5A]/30 group-hover:shadow-[0_0_20px_rgba(231, 58, 90,0.15)] overflow-hidden backdrop-blur-md">
        
        {/* Image Area */}
        {imageUrl ? (
          <div className="h-48 border-b border-white/10 overflow-hidden bg-muted">
             <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
          </div>
        ) : (
          <div className="bg-[#E73A5A]/10 h-48 border-b border-white/10 flex items-center justify-center relative overflow-hidden">
            <BookOpen className="w-16 h-16 text-[#E73A5A]/60 opacity-50 transform group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
          </div>
        )}

        <div className="p-5 md:p-6 flex flex-col flex-grow">
          {/* Category Badge */}
          <div className="mb-4 self-start">
            <span className="bg-[#E73A5A]/10 text-[#E73A5A] border border-[#E73A5A]/20 rounded font-black uppercase text-[10px] tracking-widest px-2.5 py-1 inline-block transition-transform duration-200 group-hover:scale-105">
              {getCategoryEmoji(category)} {category || 'Engineering'}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-3 line-clamp-2 hover:text-[#E73A5A] transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 font-medium text-sm md:text-base line-clamp-3 mb-6 flex-grow">
            {description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase text-gray-300">{author || 'Admin'}</span>
              <span className="text-xs font-medium text-gray-500">{formattedDate}</span>
            </div>
            
            {/* Read More Button */}
            <div className="w-10 h-10 bg-[#E73A5A] rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95 shadow-[0_0_10px_rgba(231, 58, 90,0.3)]">
              <ArrowRight className="w-5 h-5 text-white transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default BlogCard;
