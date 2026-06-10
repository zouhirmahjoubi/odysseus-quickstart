
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';
import { Button } from '@/components/ui/button';
import { MonitorPlay, Terminal, Cpu } from 'lucide-react';

const WorkspaceSimulator = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <Helmet>
        <title>Workspace Simulator | World #1 Digital Marketplace</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbNav />
        
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4 uppercase tracking-wider">
            Beta Feature
          </div>
          <h1 className="text-4xl font-extrabold mb-4 text-balance">Workspace Simulator</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Test and simulate environments from the World #1 Digital Marketplace before deploying to production infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-8 border rounded-2xl bg-card hover:border-primary/50 transition-colors flex flex-col items-center text-center">
             <div className="p-4 bg-muted rounded-full mb-6 text-foreground"><MonitorPlay size={32}/></div>
             <h3 className="text-xl font-bold mb-2">UI Sandbox</h3>
             <p className="text-sm text-muted-foreground mb-6">Test frontend component rendering and responsiveness in an isolated iframe environment.</p>
             <Button variant="outline" className="w-full mt-auto">Launch Sandbox</Button>
          </div>
          
          <div className="p-8 border-2 border-primary rounded-2xl bg-primary/5 relative flex flex-col items-center text-center">
             <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Active</div>
             <div className="p-4 bg-primary text-primary-foreground rounded-full mb-6"><Terminal size={32}/></div>
             <h3 className="text-xl font-bold mb-2">Agent Terminal</h3>
             <p className="text-sm text-muted-foreground mb-6">Interact with pre-configured market agents through a secure simulated command line interface.</p>
             <Button className="w-full mt-auto">Start Terminal Session</Button>
          </div>

          <div className="p-8 border rounded-2xl bg-card hover:border-primary/50 transition-colors flex flex-col items-center text-center opacity-70">
             <div className="p-4 bg-muted rounded-full mb-6 text-foreground"><Cpu size={32}/></div>
             <h3 className="text-xl font-bold mb-2">Hardware Emulation</h3>
             <p className="text-sm text-muted-foreground mb-6">Simulate inference speed and memory constraints on virtualized GPU clusters.</p>
             <Button variant="secondary" className="w-full mt-auto" disabled>Coming Soon</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSimulator;
