
import React from 'react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: '📦',
      title: 'Premium Templates',
      description: 'High-quality, responsive templates for your next big project.'
    },
    {
      icon: '</>',
      title: 'UI Kits & Components',
      description: 'Ready-to-use components to speed up your development workflow.'
    },
    {
      icon: '🛡️',
      title: 'Secure Transactions',
      description: 'Safe and encrypted payments for all your digital purchases.'
    }
  ];

  return (
    <section className="bg-[hsl(var(--why-choose-bg))] section-padding">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-[40px] md:mb-[60px]">
          <h2 className="space-grotesk text-section font-bold text-[hsl(var(--text-primary))] leading-tight mb-[15px]">
            Why Choose Us
          </h2>
          <p className="text-sub text-[hsl(var(--text-secondary))] max-w-[600px] mx-auto">
            We provide the best tools and resources to help you build faster and better.
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

export default WhyChooseUs;
