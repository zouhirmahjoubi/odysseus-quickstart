
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart.jsx';
import { formatCurrency } from '@/api/EcommerceApi.js';
import PageTransition from '@/components/PageTransition.jsx';

const ShoppingCartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const tax = Math.round(subtotal * 0.10);
  const shipping = subtotal > 10000 ? 0 : 1000; // Free shipping over $100
  const total = subtotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <PageTransition>
        <Helmet><title>Cart - OdysseusAI</title></Helmet>
        <div className="max-w-4xl mx-auto py-20 px-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-32 h-32 bg-[hsl(var(--pale-yellow))] border-[3px] border-black flex items-center justify-center rounded-full mb-8 shadow-[8px_8px_0px_0px_#000000]">
            <ShoppingBag size={64} className="text-black" />
          </div>
          <h1 className="text-4xl font-black space-grotesk mb-4 text-[hsl(var(--foreground))]">Your Cart is Empty</h1>
          <p className="text-xl font-bold text-[hsl(var(--muted-foreground))] mb-8 text-center max-w-md">Looks like you haven't added any premium blueprints to your workspace yet.</p>
          <button onClick={() => navigate('/shop')} className="neo-button bg-[hsl(var(--primary-accent))] text-black text-lg px-8 py-4">
            Browse Asset Store
          </button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Helmet><title>Shopping Cart - OdysseusAI</title></Helmet>
      
      <div className="max-w-6xl mx-auto py-8 md:py-16 px-4 md:px-8 w-full">
        <h1 className="text-4xl md:text-5xl font-black space-grotesk mb-8 md:mb-12 text-[hsl(var(--foreground))] border-b-[3px] border-black pb-4">
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
          {/* Items List */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {cartItems.map(item => {
              const price = item.variant?.price_in_cents || item.price_in_cents || 0;
              return (
                <div key={`${item.id}-${item.variant?.id}`} className="neo-card p-4 md:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white dark:bg-black items-start sm:items-center">
                  <div className="w-full sm:w-32 h-40 sm:h-32 bg-[hsl(var(--sky-blue))] border-[3px] border-black flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag size={40} className="text-black" />
                    )}
                  </div>
                  
                  <div className="flex-1 w-full">
                    <h3 className="text-xl md:text-2xl font-bold space-grotesk text-black dark:text-white mb-2 leading-tight">
                      {item.title || item.name}
                    </h3>
                    <p className="font-bold text-[hsl(var(--primary-accent))] text-lg mb-4">
                      {formatCurrency(price)}
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                      <div className="flex items-center border-[3px] border-black bg-white h-10">
                        <button onClick={() => updateQuantity(item.id, item.variant?.id, Math.max(1, item.quantity - 1))} className="px-3 hover:bg-gray-200 text-black font-black h-full">-</button>
                        <span className="px-4 border-l-[3px] border-r-[3px] border-black font-black text-black flex items-center justify-center h-full w-12">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.variant?.id, item.quantity + 1)} className="px-3 hover:bg-gray-200 text-black font-black h-full">+</button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id, item.variant?.id)}
                        className="flex items-center font-bold text-red-600 hover:text-red-800 transition-colors p-2"
                      >
                        <Trash2 size={18} className="mr-2" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <button onClick={() => navigate('/shop')} className="font-bold text-lg mt-4 w-fit hover:underline text-[hsl(var(--foreground))]">
              ← Continue Shopping
            </button>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="neo-card p-6 md:p-8 sticky top-24 bg-[hsl(var(--pale-yellow))] dark:bg-[hsl(var(--card-bg))]">
              <h2 className="text-2xl font-black space-grotesk mb-6 text-black dark:text-white border-b-[3px] border-black pb-4">
                Order Summary
              </h2>
              
              <div className="flex flex-col gap-4 text-black dark:text-white font-bold text-lg mb-6 border-b-[3px] border-black pb-6">
                <div className="flex justify-between">
                  <span className="opacity-80">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Tax (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8 text-black dark:text-white">
                <span className="text-2xl font-black space-grotesk">Total</span>
                <span className="text-3xl font-black space-grotesk text-[hsl(var(--primary-accent))] bg-black dark:bg-white px-3 py-1 border-[3px] border-black shadow-[4px_4px_0px_0px_#BBF7D0]">
                  {formatCurrency(total)}
                </span>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="neo-button bg-[hsl(var(--primary-accent))] text-black w-full text-lg py-4 flex justify-center items-center"
              >
                Proceed to Checkout <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ShoppingCartPage;
