
import React from 'react';
import { Helmet } from 'react-helmet';
import { Cpu, Target, Database, Lock, Mail, Bot } from 'lucide-react';
import PageTransition from '@/components/PageTransition.jsx';
import NeoBrutalCard from '@/components/NeoBrutalCard.jsx';

function FeaturesPage() {
  const detailedFeatures = [
    { 
      title: 'High-Performance Templates', 
      icon: Cpu,
      color: 'text-[hsl(var(--cyan))]',
      description: 'Optimized React and Next.js templates that score 100 on Lighthouse out of the box.'
    },
    { 
      title: 'Advanced UI Components', 
      icon: Target,
      color: 'text-[hsl(var(--green))]',
      description: 'Accessible, customizable, and beautifully designed components ready to drop into your app.'
    },
    { 
      title: 'Secure Authentication', 
      icon: Lock,
      color: 'text-[hsl(var(--yellow))]',
      description: 'Pre-configured auth flows with JWT, OAuth, and role-based access control.'
    },
    { 
      title: 'Database Integrations', 
      icon: Database,
      color: 'text-[hsl(var(--orange))]',
      description: 'Seamless connections to PostgreSQL, MongoDB, and PocketBase with typed schemas.'
    }
  ];

  return (
    <PageTransition>
      <Helmet>
        <title>Features - OdysseusAI</title>
        <meta name="description" content="Explore the powerful features of our digital products." />
      </Helmet>

      <section className="gradient-purple-bg pt-20 pb-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">Premium Features</h1>
          <p className="text-xl font-bold max-w-3xl mx-auto text-white/90">
            Everything you need to build production-ready applications in record time.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {detailedFeatures.map((feature, index) => (
              <NeoBrutalCard key={index} gradientBorder="top" className="p-8">
                <div className="flex items-center gap-6 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center ${feature.color}`}>
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">{feature.title}</h3>
                </div>
                <p className="text-lg font-medium text-muted-foreground">{feature.description}</p>
              </NeoBrutalCard>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default FeaturesPage;
