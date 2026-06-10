
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, ShoppingCart, Filter, Zap, Cpu, MessageSquare, Brain } from 'lucide-react';
import { useCart } from '@/hooks/useCart.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { formatCurrency } from '@/api/EcommerceApi.js';
import { MODELS } from '@/data/modelDatabase.js';
import { toast } from 'sonner';

const BUNDLES = [
  { id: 'b-rag', name: 'RAG Specialist Bundle', icon: <Zap size={24} />, desc: 'Optimized setup for Retrieval-Augmented Generation workflows.', price: 49900, color: 'bg-primary' },
  { id: 'b-code', name: 'Code Master Bundle', icon: <Cpu size={24} />, desc: 'Elite code generation and review architecture blueprints.', price: 59900, color: 'bg-secondary' },
  { id: 'b-chat', name: 'Chat Expert Bundle', icon: <MessageSquare size={24} />, desc: 'High-throughput conversational AI configurations.', price: 39900, color: 'bg-accent' },
  { id: 'b-reason', name: 'Reasoning Pro Bundle', icon: <Brain size={24} />, desc: 'Heavyweight models for complex logic and math tasks.', price: 89900, color: 'bg-muted' }
];

const ProductsPage = () => {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const records = await pb.collection('products').getList(1, 20, {
          filter: 'status="active"',
          $autoCancel: false
        });
        setDbProducts(records.items);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const displayModels = MODELS.filter(m => m.price).slice(0, 24);
  const filteredModels = displayModels.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.family.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (item, type = 'model') => {
    const cartProduct = {
      id: item.id,
      title: item.name,
      image_url: null,
    };
    const variant = {
      id: `${item.id}-default`,
      price_in_cents: item.price || 0,
      title: type === 'bundle' ? 'Bundle' : 'Preset Config',
      currency_info: { code: 'USD', symbol: '$' }
    };
    
    addToCart(cartProduct, variant, 1, 999);
    toast.success(`${item.name} added to cart! 🛍️`);
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 pt-6 md:pt-12 px-4 sm:px-6">
      <Helmet>
        <title>Marketplace | OdysseusAI</title>
      </Helmet>

      <div className="mb-10 md:mb-16 neo-border bg-card p-6 md:p-8 gradient-bg-cute shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
        <div className="inline-block bg-primary text-primary-foreground border-2 border-border px-3 py-1 md:px-4 md:py-1 font-black uppercase tracking-widest mb-4 md:mb-6 rounded-[var(--radius-sm)] shadow-sm text-xs md:text-sm">
          Asset Store
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase leading-none mb-4 md:mb-6 text-balance">
          Digital Marketplace
        </h1>
        <p className="text-base md:text-xl font-poppins font-medium max-w-3xl text-foreground/80">
          Premium LLM presets, agent blueprints, and infrastructure configurations. Verified and ready for immediate deployment.
        </p>
      </div>

      {/* Bundles Section */}
      <div className="mb-12 md:mb-20">
        <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 md:mb-8 flex items-center gap-2 md:gap-3">
          <span className="text-3xl md:text-4xl">🎁</span> Model Starter Packs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {BUNDLES.map(bundle => (
            <div key={bundle.id} className="cute-card flex flex-col h-full p-5 md:p-6 relative overflow-hidden group cursor-pointer" onClick={() => handleAddToCart(bundle, 'bundle')}>
              <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${bundle.color} opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[var(--radius-md)] ${bundle.color} text-foreground border-2 border-border flex items-center justify-center mb-3 md:mb-4 shadow-sm animate-bounce-hover`}>
                {bundle.icon}
              </div>
              <h3 className="text-lg md:text-xl font-black uppercase mb-2 leading-tight">{bundle.name}</h3>
              <p className="font-poppins text-xs md:text-sm text-muted-foreground mb-4 md:mb-6 flex-1">{bundle.desc}</p>
              <div className="flex items-center justify-between border-t-2 border-border/20 pt-4 mt-auto">
                <span className="font-black text-base md:text-lg">{formatCurrency(bundle.price, { code: 'USD', symbol: '$' })}</span>
                <button className="bg-foreground text-background px-3 py-2 md:px-4 md:py-2 font-bold rounded-[var(--radius-sm)] text-xs md:text-sm shadow-sm transition-transform active:scale-95">
                  Add Bundle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-8 md:mb-10">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-muted-foreground" strokeWidth={3} />
          <input 
            type="text" 
            placeholder="Search individual models..." 
            className="neo-input pl-12 md:pl-14 rounded-[var(--radius-md)] uppercase text-sm md:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="neo-button bg-secondary text-secondary-foreground w-full md:w-auto rounded-[var(--radius-md)]"
        >
          <Filter className="mr-2 w-5 h-5 md:w-6 md:h-6" strokeWidth={3} /> Filters
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredModels.map(model => (
          <div key={model.id} className="cute-card flex flex-col h-full bg-card p-4 md:p-5 group">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <span className="text-3xl md:text-4xl group-hover:animate-spin-cute inline-block origin-center transition-transform">{model.cute_icon}</span>
              <div className="flex flex-col gap-1 md:gap-2 items-end">
                {model.is_popular && <span className="cute-badge bg-secondary text-secondary-foreground text-[8px] md:text-[10px]">🔥 POPULAR</span>}
                {model.is_new && <span className="cute-badge bg-accent text-accent-foreground text-[8px] md:text-[10px]">✨ NEW</span>}
              </div>
            </div>
            
            <h3 className="text-lg md:text-xl font-black uppercase leading-tight mb-1">{model.name}</h3>
            <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase mb-3 md:mb-4 tracking-wider">{model.family} Family</p>
            
            <div className="grid grid-cols-2 gap-2 mb-4 md:mb-6 font-poppins text-xs md:text-sm border-y-2 border-border/10 py-3 md:py-4 flex-1">
              <div className="flex flex-col">
                <span className="text-muted-foreground font-bold text-[10px] md:text-xs">VRAM</span>
                <span className="font-semibold">{model.vram} GB</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-bold text-[10px] md:text-xs">PARAMS</span>
                <span className="font-semibold">{model.parameters} B</span>
              </div>
              <div className="col-span-2 flex flex-col mt-2">
                <span className="text-muted-foreground font-bold text-[10px] md:text-xs mb-1">BEST FOR</span>
                <div className="flex gap-1 flex-wrap">
                  {model.recommended_for.slice(0,2).map(tag => (
                    <span key={tag} className="text-[8px] md:text-[10px] font-bold bg-muted px-2 py-0.5 rounded-[var(--radius-sm)] border border-border/20">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-auto">
              <span className="font-black text-lg md:text-xl text-foreground">
                {formatCurrency(model.price, { code: 'USD', symbol: '$' })}
              </span>
              <button 
                onClick={() => handleAddToCart(model)}
                className="touch-target bg-primary text-primary-foreground border-2 border-border shadow-sm rounded-[var(--radius-md)] hover:-translate-y-1 hover:shadow-md transition-all active:translate-y-0 active:shadow-none animate-bounce-hover"
                title="Add to Cart"
              >
                <ShoppingCart size={18} md:size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredModels.length === 0 && (
        <div className="cute-card bg-card p-10 md:p-16 text-center mt-6 md:mt-8">
          <span className="text-4xl md:text-6xl mb-4 block">🔍</span>
          <h3 className="text-xl md:text-2xl font-black uppercase mb-2">No Models Found</h3>
          <p className="font-poppins font-medium text-muted-foreground text-sm md:text-base">Try searching for a different family or capability.</p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
