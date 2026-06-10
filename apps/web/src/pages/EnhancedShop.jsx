
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Filter, ShoppingCart, Tag, ChevronDown, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { useCart } from '@/hooks/useCart.jsx';
import { formatCurrency } from '@/api/EcommerceApi.js';
import { toast } from 'sonner';

const EnhancedShop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsRes, prodsRes] = await Promise.all([
          pb.collection('categories').getFullList({ sort: 'displayOrder', $autoCancel: false }),
          pb.collection('products').getFullList({ expand: 'category', sort: '-created', $autoCancel: false })
        ]);
        setCategories(catsRes);
        setProducts(prodsRes);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load shop data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Client-side filtering and sorting
  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => 
      p.name?.toLowerCase().includes(search.toLowerCase()) || 
      p.description?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const getPrice = (prod) => prod.discount_price || prod.price || 0;
      if (sortBy === 'price-low') return getPrice(a) - getPrice(b);
      if (sortBy === 'price-high') return getPrice(b) - getPrice(a);
      if (sortBy === 'newest') return new Date(b.created) - new Date(a.created);
      return 0;
    });

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    // Reconstruct variant structure for cart if needed
    const price = product.discount_price || product.price;
    const variant = { id: product.id, title: 'Default', price_in_cents: Math.round(price * 100), currency_info: { code: 'USD' } };
    addToCart({ id: product.id, title: product.name, image_url: product.image }, variant, 1, product.stock);
    toast.success('Added to cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet><title>Asset Store - OdysseusAI</title></Helmet>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="neo-card sticky top-24 bg-white">
            <div className="flex items-center justify-between mb-6 border-b-3 border-black pb-4">
              <h2 className="text-xl font-black space-grotesk flex items-center gap-2">
                <Filter size={20} /> Filters
              </h2>
              <button 
                onClick={() => { setSelectedCategory('all'); setSearch(''); setSortBy('newest'); }}
                className="text-sm font-bold text-gray-500 hover:text-black"
              >
                Clear
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-3">Categories</h3>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className={`text-left px-3 py-2 font-bold text-sm neo-border transition-colors ${selectedCategory === 'all' ? 'bg-[hsl(var(--primary))]' : 'bg-white hover:bg-gray-100'}`}
                >
                  All Products
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-left px-3 py-2 font-bold text-sm neo-border transition-colors ${selectedCategory === cat.id ? 'bg-[hsl(var(--primary))]' : 'bg-white hover:bg-gray-100'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Search blueprints..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="neo-input pl-10"
              />
              <Search className="absolute left-3 top-3.5 text-gray-500" size={20} />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-3.5 text-gray-500 hover:text-black">
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="relative w-full md:w-auto">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="neo-input appearance-none pr-10 w-full md:w-auto cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 pointer-events-none" size={20} />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-[400px] bg-gray-200 neo-border"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="neo-card bg-[hsl(var(--background))] text-center py-20">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-black space-grotesk mb-2">No products found</h3>
              <p className="font-bold opacity-70">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => {
                const isDiscounted = !!product.discount_price;
                const price = isDiscounted ? product.discount_price : product.price;
                
                return (
                  <Link key={product.id} to={`/product/${product.id}`} className="group outline-none block h-full">
                    <div className="neo-card p-0 flex flex-col h-full bg-white hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] cursor-pointer relative">
                      
                      {isDiscounted && (
                        <div className="absolute -top-3 -right-3 z-10 bg-[hsl(var(--primary))] px-3 py-1 font-black text-sm neo-border shadow-[2px_2px_0px_0px_#000000] rotate-3">
                          SALE
                        </div>
                      )}

                      <div className="w-full aspect-[4/3] bg-[hsl(var(--secondary))] border-b-3 border-black p-4 flex items-center justify-center">
                        <Tag size={48} className="opacity-50" />
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                          {product.expand?.category?.name || 'Uncategorized'}
                        </div>
                        <h3 className="text-xl font-black space-grotesk mb-2 line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                        
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-lg">${price?.toFixed(2)}</span>
                            {isDiscounted && <span className="font-bold text-sm text-gray-400 line-through">${product.price?.toFixed(2)}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border-t-3 border-black">
                        <button 
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={product.stock <= 0}
                          className="neo-button w-full bg-black text-white hover:bg-[hsl(var(--primary))] hover:text-black py-2 px-4 h-12"
                        >
                          {product.stock > 0 ? <><ShoppingCart size={18} className="mr-2" /> Add to Cart</> : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EnhancedShop;
