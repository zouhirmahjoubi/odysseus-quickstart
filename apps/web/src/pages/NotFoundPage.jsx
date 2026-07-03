
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import PageTransition from '@/components/PageTransition.jsx';
import NeoBrutalButton from '@/components/NeoBrutalButton.jsx';

const robotAscii = `
    [  O _ O  ]
   /|   ___   |\\
  / |         | \\
    |__|   |__|
`;

const NotFoundPage = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>404 - Page Not Found | Odysseusai.ai</title>
      </Helmet>

      <div className="min-h-[80vh] flex flex-col items-center justify-center py-[60px] px-[20px] relative overflow-hidden">
        
        {/* Decorative background blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[hsl(var(--accent))] opacity-20 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[hsl(var(--secondary))] opacity-20 blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-[800px] w-full mx-auto relative z-10 text-center flex flex-col items-center">
          
          {/* Main 404 Card */}
          <div className="bg-[hsl(var(--card))] border-[4px] border-[hsl(var(--border))] shadow-[12px_12px_0px_0px_hsl(var(--border))] p-[30px] md:p-[60px] w-full max-w-[600px] relative transition-transform duration-300 hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_hsl(var(--secondary))]">
            
            {/* Top decorative pill */}
            <div className="absolute -top-[20px] left-1/2 -translate-x-1/2 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] border-[3px] border-[hsl(var(--border))] px-[20px] py-[5px] font-bold space-grotesk tracking-wider uppercase text-sm shadow-[4px_4px_0px_0px_hsl(var(--border))] whitespace-nowrap">
              System Error
            </div>

            <div className="text-[100px] md:text-[160px] leading-none font-black space-grotesk text-[hsl(var(--foreground))] drop-shadow-[6px_6px_0px_hsl(var(--primary))] mb-[20px]">
              404
            </div>
            
            <h1 className="text-[24px] md:text-[32px] font-black space-grotesk text-[hsl(var(--foreground))] mb-[15px] leading-tight">
              Lost in the marketplace?
            </h1>
            
            <p className="text-[16px] md:text-[18px] font-medium text-[hsl(var(--muted))] mb-[30px] max-w-[400px] mx-auto leading-relaxed">
              The digital asset, agent, or endpoint you're looking for seems to have been relocated or doesn't exist in our current registry.
            </p>

            {/* ASCII Art Box */}
            <div className="mb-[40px] inline-block bg-[hsl(var(--background))] border-[3px] border-[hsl(var(--border))] p-[15px] shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.05)]">
              <pre className="font-jetbrains-mono text-[hsl(var(--primary))] text-[14px] md:text-[16px] leading-[1.2] font-bold text-center m-0">
                {robotAscii}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-[15px] justify-center items-center">
              <Link to="/" className="w-full sm:w-auto">
                <NeoBrutalButton variant="primary" className="w-full">
                  <ArrowLeft size={20} />
                  Return Home
                </NeoBrutalButton>
              </Link>
              <Link to="/odysseus-search" className="w-full sm:w-auto">
                <NeoBrutalButton variant="secondary" className="w-full bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))]">
                  <Search size={20} />
                  Search Store
                </NeoBrutalButton>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default NotFoundPage;
