
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-[hsl(var(--sidebar))] border-t-[4px] md:border-t-[8px] border-black px-[20px] py-[40px] z-50 relative mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start transition-transform duration-300 hover:scale-[1.02] origin-left">
          <Link to="/" className="flex items-center gap-[6px] md:gap-[8px] focus:outline-none mb-1">
            <span className="font-[900] text-[20px] md:text-[24px] tracking-[2px] text-black uppercase leading-none mt-1">
              ODYSSEUS
            </span>
            <span className="bg-[hsl(var(--orange))] text-black border-[3px] md:border-[4px] border-black rounded-[8px] md:rounded-[12px] px-[8px] py-[2px] font-[900] text-[12px] md:text-[14px] uppercase leading-none flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              AI
            </span>
          </Link>
          <span className="text-[hsl(var(--orange))] font-[900] text-[12px] lg:text-[14px] tracking-[1px] leading-tight ml-1 mt-0.5">
            AI.AI
          </span>
        </div>
        
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
          <Link to="/" className="font-black text-[14px] text-black hover:text-[hsl(var(--active-green))] transition-colors uppercase tracking-wide">Home</Link>
          <Link to="/products" className="font-black text-[14px] text-black hover:text-[hsl(var(--active-green))] transition-colors uppercase tracking-wide">Products</Link>
          <Link to="/blog" className="font-black text-[14px] text-black hover:text-[hsl(var(--active-green))] transition-colors uppercase tracking-wide">Blog</Link>
          <Link to="/calculator" className="font-black text-[14px] text-black hover:text-[hsl(var(--active-green))] transition-colors uppercase tracking-wide">Calculator</Link>
          <Link to="/workspace-simulator" className="font-black text-[14px] text-black hover:text-[hsl(var(--active-green))] transition-colors uppercase tracking-wide">Simulator</Link>
          <Link to="/privacy" className="font-black text-[14px] text-black hover:text-[hsl(var(--active-green))] transition-colors uppercase tracking-wide">Privacy</Link>
          <Link to="/terms" className="font-black text-[14px] text-black hover:text-[hsl(var(--active-green))] transition-colors uppercase tracking-wide">Terms</Link>
        </nav>
        
        <div className="text-black font-bold text-[12px] md:text-[14px] bg-white border-[3px] border-black px-[12px] py-[6px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          &copy; {new Date().getFullYear()} OdysseusAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
