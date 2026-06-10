
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { 
  ArrowRight, Cpu, Database, Shield, Zap, Terminal, Box, BookOpen, AlertCircle,
  LayoutGrid, ShoppingBag, Calculator, Monitor, FileText
} from 'lucide-react';
import BlogCard from '@/components/BlogCard.jsx';
import pb from '@/lib/pocketbaseClient';
import { Skeleton } from '@/components/ui/skeleton';

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [blogError, setBlogError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingBlogs(true);
        setBlogError(null);
        const records = await pb.collection('blog_articles').getList(1, 4, {
          filter: 'status="published"',
          sort: '-created_at,-created',
          $autoCancel: false
        });
        setBlogs(records.items);
      } catch (error) {
        console.error("Error fetching blogs for homepage:", error);
        setBlogError("Could not load latest insights.");
      } finally {
        setLoadingBlogs(false);
      }
    };
    
    fetchBlogs();
  }, []);

  const features = [
    { icon: Cpu, title: 'Hardware Optimized', desc: 'Pre-configured models tuned for specific consumer and enterprise GPU architectures.', color: 'bg-primary' },
    { icon: Database, title: 'RAG Ready', desc: 'Long-context models specifically evaluated for retrieval-augmented generation tasks.', color: 'bg-secondary' },
    { icon: Shield, title: 'Local Privacy', desc: 'Run everything on-premise. Zero data leaves your infrastructure.', color: 'bg-accent' },
    { icon: Zap, title: 'Instant Deploy', desc: 'Docker-compose blueprints and one-click deployment scripts included.', color: 'bg-primary' },
    { icon: Terminal, title: 'Agent Swarms', desc: 'Pre-built CrewAI and AutoGen configurations for autonomous task execution.', color: 'bg-secondary' },
    { icon: Box, title: 'Quantized Weights', desc: 'GGUF, EXL2, and AWQ formats available for maximum efficiency.', color: 'bg-accent' },
  ];

  const mobileNavItems = [
    { name: 'HOME', icon: LayoutGrid, path: '/' },
    { name: 'MARKETPLACE', icon: ShoppingBag, path: '/products' },
    { name: 'CALCULATOR', icon: Calculator, path: '/calculator' },
    { name: 'SIMULATOR', icon: Monitor, path: '/workspace-simulator' },
    { name: 'BLOG', icon: FileText, path: '/blog' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 md:space-y-24 pt-6 md:pt-12 px-4 sm:px-6 pb-[120px] md:pb-24">
      <Helmet>
        <title>OdysseusAI | World #1 Digital Marketplace</title>
      </Helmet>

      {/* Hero Section - Mobile Only */}
      <section className="block md:hidden relative w-full">
        <div className="bg-[hsl(var(--background))] border-y-4 md:border-4 border-black p-10 md:p-[60px_40px] flex flex-col items-center text-center relative overflow-hidden min-h-[400px] md:min-h-[500px] justify-center md:rounded-lg shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -mx-4 sm:mx-0">
          
          <div className="inline-block bg-accent text-black border-4 border-black px-[20px] py-[12px] font-black uppercase tracking-widest mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm md:text-base">
            WORLD #1 DIGITAL MARKETPLACE
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[1.1] mb-6 max-w-5xl text-balance">
            <span className="text-black block">THE FOUNDATION OF THE</span>
            <span className="text-primary block">DIGITAL ECONOMY</span>
          </h1>
          
          <p className="text-base sm:text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mb-10 md:mb-12 leading-relaxed text-balance">
            Procure premium digital assets, enterprise-grade LLM models, and battle-tested software architectures. Deploy locally, scale globally.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto">
            <Link to="/products" className="neo-button bg-primary text-black font-black uppercase text-base md:text-xl px-6 py-4 md:px-10 md:py-5 w-full md:w-auto rounded-lg">
              Explore Marketplace <ArrowRight className="ml-2" strokeWidth={3} />
            </Link>
            <Link to="/workspace-simulator" className="neo-button bg-[hsl(var(--white))] text-black font-black uppercase text-base md:text-xl px-6 py-4 md:px-10 md:py-5 w-full md:w-auto rounded-lg">
              Launch Simulator
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section>
        <h2 className="text-2xl md:text-4xl font-black uppercase mb-6 md:mb-10 inline-block border-b-4 border-black pb-2">Command Center</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <Link to="/products" className="neo-card neo-card-hover bg-primary p-6 md:p-8 flex flex-col h-full">
            <Box size={36} md:size={48} strokeWidth={2} className="mb-4 md:mb-6 text-black" />
            <h3 className="text-xl md:text-2xl font-black uppercase mb-2 md:mb-4 text-black">Asset Store</h3>
            <p className="font-bold text-black/80 mt-auto text-sm md:text-base">Browse premium models and blueprints.</p>
          </Link>
          <Link to="/calculator" className="neo-card neo-card-hover bg-secondary p-6 md:p-8 flex flex-col h-full">
            <Cpu size={36} md:size={48} strokeWidth={2} className="mb-4 md:mb-6 text-black" />
            <h3 className="text-xl md:text-2xl font-black uppercase mb-2 md:mb-4 text-black">VRAM Calc</h3>
            <p className="font-bold text-black/80 mt-auto text-sm md:text-base">Estimate hardware requirements instantly.</p>
          </Link>
          <Link to="/resources" className="neo-card neo-card-hover bg-accent p-6 md:p-8 flex flex-col h-full">
            <Database size={36} md:size={48} strokeWidth={2} className="mb-4 md:mb-6 text-black" />
            <h3 className="text-xl md:text-2xl font-black uppercase mb-2 md:mb-4 text-black">Reference</h3>
            <p className="font-bold text-black/80 mt-auto text-sm md:text-base">LLM specs and workload frameworks.</p>
          </Link>
          <Link to="/workspace-simulator" className="neo-card neo-card-hover bg-[hsl(var(--white))] p-6 md:p-8 flex flex-col h-full">
            <Terminal size={36} md:size={48} strokeWidth={2} className="mb-4 md:mb-6 text-black" />
            <h3 className="text-xl md:text-2xl font-black uppercase mb-2 md:mb-4 text-black">Simulator</h3>
            <p className="font-bold text-black/80 mt-auto text-sm md:text-base">Test prompts in a secure sandbox.</p>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-2xl md:text-4xl font-black uppercase mb-6 md:mb-10 inline-block border-b-4 border-black pb-2">Core Capabilities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="neo-card p-6 md:p-8 flex flex-col bg-[hsl(var(--white))]">
              <div className={`w-12 h-12 md:w-16 md:h-16 ${feature.color} border-4 border-black flex items-center justify-center mb-4 md:mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md`}>
                <feature.icon size={24} md:size={32} strokeWidth={2.5} className="text-black" />
              </div>
              <h3 className="text-lg md:text-2xl font-black uppercase mb-2 md:mb-4 text-black">{feature.title}</h3>
              <p className="font-bold text-muted-foreground text-sm md:text-lg leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Cards Grid Section */}
      <section>
        <div className="flex items-center justify-between mb-6 md:mb-10 border-b-4 border-black pb-2">
          <h2 className="text-2xl md:text-4xl font-black uppercase inline-block">Latest Insights</h2>
          <Link to="/blog" className="hidden sm:flex items-center text-sm md:text-base font-black uppercase tracking-widest hover:text-primary transition-colors">
            View All <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
        
        {blogError ? (
          <div className="neo-card bg-destructive/10 border-destructive p-8 flex items-center gap-4 text-destructive font-bold">
            <AlertCircle size={32} />
            <p>{blogError}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {loadingBlogs ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border-4 border-black rounded-lg overflow-hidden h-[400px] flex flex-col">
                  <Skeleton className="h-48 w-full rounded-none" />
                  <div className="p-6 flex flex-col flex-grow bg-card gap-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              ))
            ) : blogs.length > 0 ? (
              blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  title={blog.title}
                  category={blog.category || 'Engineering'}
                  description={blog.excerpt || blog.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                  author={blog.author || 'Odysseus Team'}
                  date={blog.created_at || blog.created}
                  slug={blog.slug}
                  imageRecord={blog}
                />
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 neo-card bg-muted p-12 flex flex-col items-center justify-center text-center">
                <BookOpen className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-xl font-black uppercase text-muted-foreground">No publications found</h3>
                <p className="text-muted-foreground font-medium mt-2">Check back soon for new insights and engineering updates.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Mobile View All button */}
        <div className="mt-8 sm:hidden text-center">
          <Link to="/blog" className="neo-button w-full bg-[hsl(var(--white))] text-black">
            View All Articles
          </Link>
        </div>
      </section>

      {/* Knowledge Base Hero Section */}
      <section>
        <Link 
          to="/resources" 
          className="block group focus:outline-none"
        >
          <div className="w-full bg-[hsl(var(--background))] border-y-4 md:border-4 border-black py-10 md:py-16 px-6 md:px-12 flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12 transition-all duration-300 group-hover:bg-primary/10 group-focus-visible:bg-primary/10 cursor-pointer overflow-hidden relative md:rounded-xl md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -mx-4 sm:mx-0">
            
            {/* Left Content */}
            <div className="flex-1 flex flex-col items-start z-10 w-full md:w-auto text-center md:text-left">
              <div className="mb-6 md:mb-8 self-center md:self-start">
                <span className="bg-primary text-black border-4 border-black rounded-lg font-black uppercase text-xs md:text-sm tracking-[0.2em] px-4 py-2 inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Knowledge Base
                </span>
              </div>
              
              <h2 className="text-[32px] md:text-[48px] leading-[1.1] font-black uppercase mb-6 mx-auto md:mx-0">
                <span className="text-black block">Engineering</span>
                <span className="text-primary block">Transmissions</span>
              </h2>
              
              <p className="text-muted-foreground font-medium text-base md:text-xl max-w-2xl mx-auto md:mx-0 mb-8 md:mb-0">
                Access our comprehensive library of technical documentation, architectural blueprints, and deep-dive research papers on local AI deployment.
              </p>
              
              <div className="mt-8 flex md:hidden items-center justify-center w-full">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform">
                  <ArrowRight className="text-white w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Right Icon */}
            <div className="flex-shrink-0 relative z-10">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:border-primary">
                <BookOpen 
                  className="w-20 h-20 md:w-28 md:h-28 text-primary drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]" 
                  strokeWidth={1.5} 
                />
              </div>
              <div className="hidden md:flex absolute -bottom-4 -left-4 w-14 h-14 bg-black rounded-full items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                <ArrowRight className="text-white w-7 h-7 group-hover:text-black" />
              </div>
            </div>
            
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
          </div>
        </Link>
      </section>

      {/* CTA Section */}
      <section className="neo-card bg-accent p-8 md:p-12 lg:p-20 text-center rounded-xl">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase mb-4 md:mb-8 text-black text-balance">Ready to Deploy?</h2>
        <p className="text-lg md:text-2xl font-bold mb-8 md:mb-12 max-w-3xl mx-auto text-black/90 text-balance">
          Join thousands of engineers building the next generation of local AI applications.
        </p>
        <Link to="/products" className="neo-button bg-[hsl(var(--white))] text-black text-lg md:text-2xl px-8 py-4 md:px-12 md:py-6 w-full sm:w-auto">
          Start Building Now
        </Link>
      </section>

      {/* Mobile Bottom Navigation (Visible only <= 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-[80px] bg-[hsl(var(--background))] border-t-4 border-black flex items-center justify-between z-50 px-1 shadow-[0px_-4px_10px_rgba(0,0,0,0.05)]">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <Link 
              key={item.name}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center min-h-[60px] h-full gap-1 transition-colors hover:bg-black/5 active:bg-black/10 rounded-lg mx-1 ${isActive ? 'text-black' : 'text-muted-foreground'}`}
            >
              <item.icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={isActive ? 'text-primary' : 'text-primary/70'} 
              />
              <span className={`text-[10px] sm:text-[12px] uppercase ${isActive ? 'font-black' : 'font-bold'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
};

export default HomePage;
