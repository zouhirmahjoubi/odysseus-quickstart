
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';
import { Globe, Target, Shield, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <Helmet>
        <title>About Us | OdysseusAI</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbNav />
        
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 uppercase tracking-wider">
            <Globe size={16} />
            <span>World #1 Digital Marketplace</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-balance">Building the Foundation of the Digital Economy</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            OdysseusAI is dedicated to providing premium, enterprise-grade digital assets, AI models, and software solutions to developers and businesses globally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div className="bg-card p-10 rounded-2xl border shadow-sm">
            <Target className="text-primary mb-6" size={40} />
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To democratize access to high-quality digital infrastructure by creating a secure, transparent, and efficient marketplace where creators and enterprises can connect, collaborate, and scale their innovations instantly.
            </p>
          </div>
          <div className="bg-card p-10 rounded-2xl border shadow-sm">
            <Globe className="text-primary mb-6" size={40} />
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              To serve as the definitive foundational layer of the modern digital economy, ensuring that every significant software project and AI deployment begins its journey with battle-tested assets sourced exclusively from our platform.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section with Requested Image */}
        <div className="mb-24 relative rounded-3xl overflow-hidden border shadow-lg bg-card">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-10 lg:p-16 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6 text-balance">Why Choose Us?</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We combine rigorous technical verification with a seamless procurement experience. Our marketplace eliminates the friction of sourcing reliable models and codebase architectures.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 font-medium"><Shield className="text-primary" size={20}/> Cryptographically Verified Assets</li>
                <li className="flex items-center gap-3 font-medium"><Zap className="text-primary" size={20}/> Hardware-Optimized Architectures</li>
                <li className="flex items-center gap-3 font-medium"><Star className="text-primary" size={20}/> 24/7 Enterprise Support Access</li>
              </ul>
              <div>
                <Link to="/products">
                  <Button size="lg" className="w-full sm:w-auto">Explore Our Offerings</Button>
                </Link>
              </div>
            </div>
            <div className="bg-muted relative min-h-[300px] lg:min-h-full">
               <img 
                 src="https://horizons-cdn.hostinger.com/8320894c-8983-41ab-9f90-e8013f656aea/4541646efc8a74c83b07bd890a14bfa5.png" 
                 alt="Why Choose Us Feature Cards" 
                 className="absolute inset-0 w-full h-full object-cover"
               />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-12 text-center">Marketplace Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "1M+", label: "Active Engineers" },
              { value: "50k+", label: "Premium Assets" },
              { value: "99.9%", label: "Uptime SLA" },
              { value: "#1", label: "Global Platform" }
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-2xl border">
                <div className="text-4xl font-extrabold text-primary mb-2">{stat.value}</div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
