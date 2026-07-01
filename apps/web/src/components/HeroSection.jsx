
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-center mt-8 mb-20">
      {/* Left Column (60%) */}
      <div className="w-full lg:w-[60%] flex flex-col items-start">
        <div className="bg-accent text-accent-foreground neo-border px-4 py-1.5 font-black uppercase tracking-widest mb-8 shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))] animate-pulse-glow">
          India's #1 Digital Marketplace
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[1.1] mb-6">
          Discover Premium <br />
          <span className="bg-foreground text-background px-3 py-1 inline-block mt-2 transform -rotate-1">
            Digital Products
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl font-semibold max-w-2xl mb-10 text-foreground/90">
          Ship your projects faster with top-tier templates, UI kits, and development resources crafted by industry experts.
        </p>
        
        <div className="flex flex-wrap gap-6 w-full sm:w-auto">
          <Link to="/resources" className="neo-btn bg-secondary text-secondary-foreground px-8 py-4 text-xl w-full sm:w-auto hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_hsl(var(--shadow-color))]">
            Browse Resources <ArrowRight strokeWidth={3} className="ml-2" />
          </Link>
          <Link to="/workspace-simulator" className="neo-btn bg-card text-card-foreground px-8 py-4 text-xl w-full sm:w-auto hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_hsl(var(--shadow-color))]">
            Try Simulator
          </Link>
        </div>
      </div>

      {/* Right Column (40%) */}
      <div className="w-full lg:w-[40%] animate-float">
        <div className="neo-card bg-card p-6 transform transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_hsl(var(--shadow-color))] duration-300">
          {/* Media Container */}
          <div className="bg-primary neo-border aspect-video flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))] overflow-hidden">
            <Code size={64} strokeWidth={2.5} className="text-primary-foreground opacity-80 animate-spin-slow" />
          </div>
          
          {/* Tags */}
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-muted text-muted-foreground neo-border px-3 py-1 text-sm font-bold uppercase tracking-wider">
              Premium Course
            </span>
            <span className="bg-secondary text-secondary-foreground neo-border px-3 py-1 text-sm font-black shadow-[2px_2px_0px_0px_hsl(var(--shadow-color))]">
              $99
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-black mb-3 uppercase">
            Complete Web Development
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex text-accent">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={20} className="fill-current" strokeWidth={2} />
              ))}
            </div>
            <span className="font-bold text-foreground/80">(4.9/5)</span>
          </div>
          
          {/* Action Button */}
          <Link to="/products" className="neo-btn bg-foreground text-background w-full py-4 text-lg hover:bg-foreground/90">
            View Details
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
