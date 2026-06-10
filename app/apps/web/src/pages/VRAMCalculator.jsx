
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const VRAMCalculator = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <Helmet>
        <title>VRAM Calculator | World #1 Digital Marketplace</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbNav />
        
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold mb-4 text-balance">Advanced VRAM & Hardware Profiler</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Calculate precise hardware requirements for AI model inference and training based on parameter count and quantization.
            </p>
          </div>
          <Link to="/calculator">
            <Button variant="outline">Back to Calculators</Button>
          </Link>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6">Hardware Targets Overview</h2>
            <Card className="overflow-hidden border shadow-sm">
              <img 
                src="https://horizons-cdn.hostinger.com/8320894c-8983-41ab-9f90-e8013f656aea/a5fdef972e5aabaf7aec32985872b5f2.png" 
                alt="Hardware Target Matrix" 
                className="w-full object-cover max-h-[500px]"
              />
              <CardContent className="p-6 bg-muted/20">
                <p className="text-muted-foreground text-sm">Target memory bandwidth and VRAM capacities for consumer RTX and Data Center class hardware.</p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Quantization Impact Matrix</h2>
            <Card className="overflow-hidden border shadow-sm">
              <img 
                src="https://horizons-cdn.hostinger.com/8320894c-8983-41ab-9f90-e8013f656aea/854f4af3b790aa0ec79ee21078953f16.png" 
                alt="Quantization Matrix" 
                className="w-full object-cover max-h-[500px]"
              />
              <CardContent className="p-6 bg-muted/20">
                <p className="text-muted-foreground text-sm">Visualizing the correlation between precision reduction (Q4_K_M vs Q8_0) and corresponding VRAM savings.</p>
              </CardContent>
            </Card>
          </section>
          
          <div className="p-8 border rounded-2xl bg-card text-center">
             <h3 className="text-xl font-bold mb-2">Interactive Calculator Loading...</h3>
             <p className="text-muted-foreground">The interactive slider module is initializing.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRAMCalculator;
