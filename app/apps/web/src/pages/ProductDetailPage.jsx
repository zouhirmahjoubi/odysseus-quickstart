
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Code, ShoppingCart, ArrowLeft, ShieldCheck, Zap, Download } from 'lucide-react';
import { getProduct, formatCurrency, getProducts } from '@/api/EcommerceApi.js';
import { useCart } from '@/hooks/useCart.jsx';
import PageTransition from '@/components/PageTransition.jsx';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const data = await getProduct(id);
        setProduct(data.product || data);
        
        // Fetch related products
        const allProds = await getProducts();
        const prodsArray = allProds.products || allProds;
        setRelatedProducts(prodsArray.filter(p => p.id !== id).slice(0, 3));
      } catch (err) {
        toast.error('Error loading product details');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    const variant = product.variants?.[0];
    addToCart(product, variant, quantity);
    toast.success(`Added ${quantity} to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-black border-t-[hsl(var(--primary-accent))] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  const variant = product.variants?.[0];
  const price = variant?.price_in_cents || product.price_in_cents || 0;

  return (
    <PageTransition>
      <Helmet>
        <title>{product.title || product.name} - Asset Store</title>
      </Helmet>

      <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 w-full">
        <button 
          onClick={() => navigate('/shop')}
          className="flex items-center font-bold text-lg mb-8 hover:text-[hsl(var(--primary-accent))] transition-colors w-fit"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Store
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          {/* Image Side */}
          <div className="w-full">
            <div className="neo-card p-0 aspect-square bg-[hsl(var(--sky-blue))] flex items-center justify-center relative overflow-hidden group">
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <Code size={96} className="text-black group-hover:scale-110 transition-transform duration-300" />
              )}
              <div className="absolute top-4 left-4 bg-white border-[3px] border-black px-4 py-2 font-bold text-sm text-black shadow-[4px_4px_0px_0px_#000000]">
                Premium Blueprint
              </div>
            </div>
          </div>

          {/* Details Side */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-black space-grotesk mb-4 text-[hsl(var(--foreground))] leading-tight">
              {product.title || product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-black text-[hsl(var(--primary-accent))] bg-black dark:bg-white px-4 py-2 border-[3px] border-black shadow-[4px_4px_0px_0px_#BBF7D0]">
                {formatCurrency(price)}
              </span>
              <div className="text-lg font-bold text-[hsl(var(--accent))] flex items-center bg-white dark:bg-black border-[3px] border-black px-3 py-2 shadow-[4px_4px_0px_0px_#000000] text-black dark:text-white">
                ⭐⭐⭐⭐⭐ <span className="text-gray-500 ml-2">({product.rating || '5.0'})</span>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert font-medium text-gray-700 dark:text-gray-300 mb-8 border-b-[3px] border-black pb-8 w-full break-words">
              {product.description || 'Premium technical blueprint. Includes comprehensive setup scripts, detailed architecture models, and optimized environments for local AI deployments. Compatible with all major hardware configurations.'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-black border-[3px] border-black text-black dark:text-white font-bold">
                <Download className="text-[hsl(var(--primary-accent))]" /> Instant Access
              </div>
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-black border-[3px] border-black text-black dark:text-white font-bold">
                <ShieldCheck className="text-[hsl(var(--secondary-accent))]" /> Quality Verified
              </div>
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-black border-[3px] border-black text-black dark:text-white font-bold sm:col-span-2">
                <Zap className="text-yellow-400" /> Lifetime Updates Included
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <div className="flex items-center border-[3px] border-black bg-white min-h-[56px]">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-6 py-2 hover:bg-gray-200 text-black font-black text-xl w-14"
                >-</button>
                <span className="px-4 py-2 border-l-[3px] border-r-[3px] border-black font-black text-xl text-black w-16 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="px-6 py-2 hover:bg-gray-200 text-black font-black text-xl w-14"
                >+</button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="neo-button bg-[hsl(var(--primary-accent))] flex-1 text-black text-lg h-[56px]"
              >
                <ShoppingCart className="mr-3" size={24} /> Add to Workspace
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t-[3px] border-black pt-16">
            <h2 className="text-3xl font-black space-grotesk mb-8 text-[hsl(var(--foreground))]">Related Blueprints</h2>
            <div className="grid-3-cols-desktop">
              {relatedProducts.map(rp => {
                const rpVariant = rp.variants?.[0];
                const rpPrice = rpVariant?.price_in_cents || rp.price_in_cents || 0;
                return (
                  <div key={rp.id} className="neo-card p-6 flex flex-col bg-white dark:bg-black cursor-pointer hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000]" onClick={() => { navigate(`/product/${rp.id}`); window.scrollTo(0,0); }}>
                    <div className="w-full h-40 bg-[hsl(var(--pale-yellow))] border-[3px] border-black flex items-center justify-center mb-4">
                      {rp.image_url ? <img src={rp.image_url} alt={rp.title} className="w-full h-full object-cover" /> : <Code size={32} className="text-black" />}
                    </div>
                    <h3 className="font-bold text-lg space-grotesk truncate mb-2 text-black dark:text-white">{rp.title || rp.name}</h3>
                    <p className="font-bold text-[hsl(var(--primary-accent))]">{formatCurrency(rpPrice)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default ProductDetailPage;
