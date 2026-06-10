
import React from 'react';

const OurFeatures = () => {
  const features = [
    { icon: '🤖', title: 'AI-Powered Tools', description: 'Leverage cutting-edge AI for smarter development' },
    { icon: '📚', title: 'Comprehensive Resources', description: 'Access thousands of templates and guides' },
    { icon: '🚀', title: 'Fast Deployment', description: 'Deploy your projects in minutes, not days' },
    { icon: '💰', title: 'Affordable Pricing', description: 'Premium quality at competitive prices' },
    { icon: '🔒', title: 'Enterprise Security', description: 'Bank-level security for your data' },
    { icon: '🌍', title: 'Global Community', description: 'Join thousands of developers worldwide.' }
  ];

  return (
    <section className="bg-[hsl(var(--why-choose-bg))] section-padding">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-[40px] md:mb-[60px]">
          <h2 className="space-grotesk text-section font-bold text-[hsl(var(--text-primary))] leading-tight mb-[15px]">
            Our Features
          </h2>
          <p className="text-sub text-[hsl(var(--text-secondary))]">
            Everything you need to succeed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] md:gap-[20px] lg:gap-[30px]">
          {features.map((feature, index) => (
            <div key={index} className="card-neo-brutal hover-shadow-increase">
              <div className="icon-container text-[24px] text-[hsl(var(--text-primary))]">
                {feature.icon}
              </div>
              <h3 className="space-grotesk text-[20px] font-bold text-[hsl(var(--text-primary))] mt-[20px]">
                {feature.title}
              </h3>
              <p className="text-body text-[hsl(var(--text-secondary))] mt-[10px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurFeatures;
