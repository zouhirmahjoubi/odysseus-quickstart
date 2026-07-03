
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';
import { BookOpen, Code, FileText, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ResourcesHub = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <Helmet>
        <title>Resources | World #1 Digital Marketplace</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbNav />
        
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold mb-4 text-balance">Marketplace Resources</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Comprehensive guides, blueprints, and manuals provided by the World #1 Digital Marketplace experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 border rounded-2xl bg-card hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Code size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">API Integration Manuals</h2>
                <p className="text-muted-foreground mb-4">Learn how to securely integrate our premium digital assets and LLM endpoints into your existing enterprise workflows.</p>
                <span className="text-sm font-semibold text-primary">Read Documentation →</span>
              </div>
            </div>
          </div>
          
          <div className="p-8 border rounded-2xl bg-card hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Server size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Deployment Blueprints</h2>
                <p className="text-muted-foreground mb-4">Step-by-step infrastructure guides for deploying quantized models and agentic templates to production cloud environments.</p>
                <span className="text-sm font-semibold text-primary">View Blueprints →</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2"><BookOpen className="text-primary"/> Latest Insights</h3>
            <p className="text-muted-foreground">Stay updated with deep dives and engineering case studies from our team.</p>
          </div>
          <Link to="/odysseus-blog">
            <Button size="lg">Visit Our Blog</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResourcesHub;
