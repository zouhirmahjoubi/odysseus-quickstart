
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, formatCurrency } from '@/api/EcommerceApi.js';
import { useCart } from '@/hooks/useCart.jsx';
import { Code, ShoppingCart, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data.products || data || []);
      } catch (err) {
        setError('Failed to load assets. Please check back later.');
        toast.error('Error loading products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants?.[0];
    addToCart(product, variant, 1);
    toast.success(`${product.title || product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-black border-t-[hsl(var(--primary-accent))] rounded-full animate-spin"></div>
        <p className="font-bold space-grotesk text-xl">Loading Asset Store...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="neo-card flex flex-col items-center justify-center py-12 bg-[#ffe5e5] text-black">
        <AlertCircle size={48} className="mb-4 text-red-600" />
        <h2 className="text-2xl font-bold space-grotesk">{error}</h2>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="neo-card py-12 text-center">
        <h2 className="text-2xl font-bold space-grotesk mb-2 text-black dark:text-white">No products found</h2>
        <p className="text-gray-600 dark:text-gray-400 font-medium">Check back soon for new blueprints.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black space-grotesk mb-4 text-[hsl(var(--foreground))]">Digital Asset Store</h1>
        <p className="text-lg font-bold text-[hsl(var(--muted-foreground))]">Premium resources and blueprints for your local AI infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const variant = product.variants?.[0];
          const price = variant?.price_in_cents || product.price_in_cents || 0;
          
          return (
            <Link key={product.id} to={`/product/${product.id}`} className="group outline-none">
              <div className="neo-card h-full flex flex-col p-6 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] cursor-pointer">
                
                {/* Image Area */}
                <div className="w-full h-[200px] bg-[hsl(var(--secondary-accent))] border-[var(--border-width)] border-black flex items-center justify-center mb-6 relative overflow-hidden group-hover:bg-[hsl(var(--primary-accent))] transition-colors">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <Code size={48} className="text-black" />
                  )}
                  <div className="absolute top-0 right-0 bg-[hsl(var(--primary-accent))] border-l-[var(--border-width)] border-b-[var(--border-width)] border-black px-3 py-1 font-bold text-sm text-black">
                    {formatCurrency(price)}
                  </div>
                </div>

                <div className="flex-grow flex flex-col">
                  <h3 className="text-xl font-bold space-grotesk text-black dark:text-[hsl(var(--foreground))] mb-2 line-clamp-2 leading-tight">
                    {product.title || product.name}
                  </h3>
                  
                  <div className="text-sm font-bold text-[hsl(var(--accent))] mb-3">
                    ⭐⭐⭐⭐⭐ <span className="text-[hsl(var(--muted-foreground))] ml-1">({product.rating || '5.0'})</span>
                  </div>
                  
                  <p className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-6 line-clamp-3">
                    {product.description || 'Premium technical blueprint including configuration files, architecture diagrams, and deployment scripts.'}
                  </p>
                </div>

                <button 
                  onClick={(e) => handleAddToCart(e, product)}
                  className="neo-button mt-auto bg-black text-white hover:bg-black/90 w-full group-hover:bg-[hsl(var(--primary-accent))] group-hover:text-black"
                >
                  <ShoppingCart size={18} className="mr-2" /> Add to Cart
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsList;
