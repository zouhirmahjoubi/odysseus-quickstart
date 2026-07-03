
import React, { useState, useEffect, useCallback } from 'react';
import { Code, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, formatCurrency } from '@/api/EcommerceApi.js';
import { useCart } from '@/hooks/useCart.jsx';
import { useNavigate } from 'react-router-dom';

const DEFAULT_MOCKS = [
  { id: 1, title: 'Complete Web Development', price_in_cents: 9900, rating: '4.9/5' },
  { id: 2, title: 'Advanced AI Integration', price_in_cents: 14900, rating: '4.8/5' },
  { id: 3, title: 'System Architecture Mastery', price_in_cents: 19900, rating: '4.7/5' }
];

const FeaturedProducts = () => {
  const [products, setProducts] = useState(DEFAULT_MOCKS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getProducts().then(res => {
      const fetched = res.products || res || [];
      if (fetched.length > 0) {
        setProducts(fetched.slice(0, 5));
      }
    }).catch(console.error);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (products.length === 0) return null;

  const activeProduct = products[currentIndex];
  const activePrice = activeProduct.variants?.[0]?.price_in_cents || activeProduct.price_in_cents || 0;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] mx-auto my-[40px] px-[15px] md:px-0">
        <div className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] p-[20px] md:p-[30px] flex flex-col transition-all duration-300 relative overflow-hidden dark:bg-[hsl(var(--card-bg))]">
          
          {/* Image Placeholder area */}
          <div className="relative w-full h-[180px] md:h-[220px] lg:h-[250px] bg-[hsl(var(--secondary-accent))] border-[3px] border-black flex items-center justify-center overflow-hidden">
            {activeProduct.image_url ? (
              <img src={activeProduct.image_url} alt={activeProduct.title} className="w-full h-full object-cover" />
            ) : (
              <Code size={48} className="text-black" />
            )}
            
            {/* Top-Left Label */}
            <div className="absolute top-0 left-0 bg-white border-r-[3px] border-b-[3px] border-black px-[12px] py-[8px] font-bold space-grotesk text-[12px] md:text-[14px] text-black">
              Premium Course
            </div>
            
            {/* Top-Right Price Tag */}
            <div className="absolute top-0 right-0 bg-[hsl(var(--primary-accent))] border-l-[3px] border-b-[3px] border-black px-[12px] py-[8px] font-bold space-grotesk text-[14px] md:text-[16px] text-black">
              {formatCurrency(activePrice)}
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              aria-label="Previous product"
              className="absolute left-[10px] top-1/2 -translate-y-1/2 w-[24px] h-[24px] md:w-[28px] md:h-[28px] lg:w-[32px] lg:h-[32px] bg-[rgba(255,255,255,0.7)] hover:bg-white border-[3px] border-black flex items-center justify-center transition-opacity opacity-70 hover:opacity-100 z-10 text-black active:scale-95"
            >
              <ChevronLeft size={20} strokeWidth={3} />
            </button>
            <button 
              onClick={nextSlide}
              aria-label="Next product"
              className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[24px] h-[24px] md:w-[28px] md:h-[28px] lg:w-[32px] lg:h-[32px] bg-[rgba(255,255,255,0.7)] hover:bg-white border-[3px] border-black flex items-center justify-center transition-opacity opacity-70 hover:opacity-100 z-10 text-black active:scale-95"
            >
              <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>

          {/* Content details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <h3 className="space-grotesk text-[20px] md:text-[24px] font-bold text-black dark:text-white mt-[20px] leading-tight w-full truncate">
                {activeProduct.title || activeProduct.name}
              </h3>
              
              <div className="text-[16px] md:text-[18px] mt-[15px] font-bold text-[hsl(var(--accent))] flex items-center">
                ⭐⭐⭐⭐⭐ <span className="text-[hsl(var(--muted-foreground))] ml-2">({activeProduct.rating || '5.0/5'})</span>
              </div>
              
              <p className="text-sm font-medium text-[hsl(var(--muted-foreground))] mt-[15px] line-clamp-2">
                {activeProduct.description || 'Elevate your projects with top-tier premium blueprints.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-[20px]">
                <button 
                  onClick={() => navigate(`/product/${activeProduct.id}`)}
                  className="flex-1 bg-black text-white dark:bg-white dark:text-black border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_#000000] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000000] font-bold py-[15px] px-[15px] transition-all duration-200 space-grotesk text-[14px] md:text-[16px] min-h-[44px]"
                >
                  View Details
                </button>
                <button 
                  onClick={() => addToCart(activeProduct, activeProduct.variants?.[0], 1)}
                  className="flex-1 bg-[hsl(var(--primary-accent))] text-black border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_#000000] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000000] font-bold py-[15px] px-[15px] transition-all duration-200 space-grotesk text-[14px] md:text-[16px] min-h-[44px]"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-[8px] mt-[20px]">
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Jump to product ${idx + 1}`}
                className={`w-[12px] h-[12px] md:w-[14px] md:h-[14px] rounded-full border-[2px] border-black transition-colors ${currentIndex === idx ? 'bg-[hsl(var(--mint-green))]' : 'bg-gray-300 dark:bg-gray-600'}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="w-full text-center mt-4">
        <button 
          onClick={() => navigate('/odysseus-shop')}
          className="neo-button inline-flex bg-white text-black text-lg px-8 hover:bg-gray-100"
        >
          View All Products
        </button>
      </div>
    </div>
  );
};

export default FeaturedProducts;
