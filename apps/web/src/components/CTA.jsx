
import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="section-padding">
      <div className="max-w-[1000px] mx-auto mt-[40px] md:mt-[80px]">
        <div className="bg-[hsl(var(--cta-bg))] border-[3px] border-[hsl(var(--border))] shadow-[var(--shadow-offset)_var(--shadow-offset)_var(--shadow-blur)_0px_hsl(var(--shadow-color))] p-[40px_20px] md:p-[60px_40px] text-center transition-all duration-300">
          <h2 className="space-grotesk text-section font-bold text-[hsl(var(--text-primary))] leading-tight mb-[15px]">
            Ready to Get Started?
          </h2>
          <p className="text-sub text-[hsl(var(--text-secondary))] mb-[30px]">
            Join thousands of developers building amazing projects
          </p>
          <Link to="/resources" className="block sm:inline-block w-full sm:w-auto">
            <button className="neo-button bg-[hsl(var(--cta-bg))] text-[hsl(var(--secondary))] w-full sm:w-auto">
              Start Your Journey
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
