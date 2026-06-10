
import React from 'react';
import { Helmet } from 'react-helmet';
import { Check } from 'lucide-react';
import PageTransition from '@/components/PageTransition.jsx';
import NeoBrutalCard from '@/components/NeoBrutalCard.jsx';
import NeoBrutalButton from '@/components/NeoBrutalButton.jsx';

function PricingPage() {
  const products = [
    {
      tier: 'Starter Kit',
      price: '₹99',
      description: 'Perfect for personal projects and learning.',
      features: ['Basic UI Components', '1 Project License', 'Community Support'],
      recommended: false
    },
    {
      tier: 'Pro Bundle',
      price: '₹499',
      description: 'Everything you need for professional applications.',
      features: ['All UI Components', 'Unlimited Projects', 'Priority Support', 'Framer Motion Animations'],
      recommended: true
    },
    {
      tier: 'Enterprise Suite',
      price: '₹1999',
      description: 'For teams and large-scale deployments.',
      features: ['Full Source Code', 'Custom Integrations', 'Dedicated Account Manager', 'White-label Rights'],
      recommended: false
    }
  ];

  return (
    <PageTransition>
      <Helmet>
        <title>Pricing - OdysseusAI</title>
        <meta name="description" content="Pricing for our premium digital products." />
      </Helmet>

      <section className="gradient-purple-bg pt-20 pb-32 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">Simple Pricing</h1>
          <p className="text-xl font-bold max-w-3xl mx-auto text-white/90">
            Invest in your workflow with our premium digital assets.
          </p>
        </div>
      </section>

      <section className="pb-20 bg-background -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <NeoBrutalCard key={idx} gradientBorder="top" className={`relative ${product.recommended ? 'scale-105 z-10 border-t-[hsl(var(--yellow))]' : ''}`}>
                {product.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[hsl(var(--green))] text-white px-4 py-1 rounded-full font-bold text-sm shadow-md">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-8 pt-4">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{product.tier}</h3>
                  <p className="text-5xl font-black text-[hsl(var(--yellow))] mb-4">{product.price}</p>
                  <p className="text-muted-foreground font-medium">{product.description}</p>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 font-medium text-foreground">
                      <div className="w-6 h-6 rounded-full bg-[hsl(var(--green))/20] flex items-center justify-center text-[hsl(var(--green))]">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <NeoBrutalButton variant={product.recommended ? 'primary' : 'secondary'} className="w-full">
                  Get Started
                </NeoBrutalButton>
              </NeoBrutalCard>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default PricingPage;
