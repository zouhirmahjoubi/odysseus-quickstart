
import React, { useState, useEffect } from 'react';
import { Code } from 'lucide-react';
import NeoBrutalButton from './NeoBrutalButton.jsx';

const PRODUCTS = [
  { title: 'Complete Web Development', price: '$99', rating: '4.9/5' },
  { title: 'Advanced AI Integration', price: '$149', rating: '4.8/5' },
  { title: 'System Architecture Mastery', price: '$199', rating: '4.7/5' },
  { title: 'DevOps & Cloud Deployment', price: '$129', rating: '4.9/5' },
  { title: 'Security Hardening Guide', price: '$79', rating: '4.6/5' }
];

const ProductShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PRODUCTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const product = PRODUCTS[currentIndex];

  return (
    <div className="w-full lg:w-[400px] lg:sticky lg:top-[60px] bg-[hsl(var(--card))] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] p-[15px] md:p-[20px] my-[15px] md:my-[30px] lg:my-0 max-w-full overflow-hidden">
      <div className="h-[150px] md:h-[200px] bg-[hsl(var(--sidebar))] border-[3px] border-black flex items-center justify-center mb-[15px] md:mb-[20px] relative overflow-hidden w-full">
        <Code size={48} className="text-black" />
        <div className="absolute top-[10px] left-[10px] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-[3px] border-black px-[10px] py-[4px] font-bold text-[10px] md:text-[12px] space-grotesk">
          Premium Course
        </div>
        <div className="absolute bottom-[10px] right-[10px] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-[3px] border-black px-[10px] py-[4px] font-bold text-[12px] md:text-[14px] space-grotesk">
          {product.price}
        </div>
      </div>
      
      <h3 className="text-[20px] md:text-[24px] font-bold space-grotesk text-[hsl(var(--card-foreground))] mt-[15px] leading-tight min-h-[50px] lg:min-h-[70px] w-full">
        {product.title}
      </h3>
      
      <div className="text-[14px] md:text-[16px] mt-[10px] font-bold text-[hsl(var(--accent))]">
        ⭐⭐⭐⭐⭐ <span className="text-[hsl(var(--muted-foreground))]">({product.rating})</span>
      </div>
      
      <div className="mt-[20px] w-full">
        <NeoBrutalButton variant="secondary" className="w-full bg-[hsl(var(--foreground))] text-[hsl(var(--background))] hover:bg-[hsl(var(--foreground))]/90 hover:text-[hsl(var(--background))]">
          View Details
        </NeoBrutalButton>
      </div>
    </div>
  );
};

export default ProductShowcase;
