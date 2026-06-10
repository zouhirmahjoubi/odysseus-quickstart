
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart.jsx';
import { formatCurrency } from '@/api/EcommerceApi.js';
import { Link, useNavigate } from 'react-router-dom';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed top-0 right-0 w-[450px] max-w-[100vw] h-[100dvh] bg-background border-l-4 border-border shadow-[-8px_0_0_0_hsl(var(--shadow-color))] z-[90] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-4 border-border bg-primary">
              <h2 className="text-2xl font-black uppercase flex items-center gap-3 text-primary-foreground">
                <ShoppingBag size={28} strokeWidth={3} /> My Cart
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 border-4 border-border bg-card text-card-foreground shadow-[2px_2px_0px_0px_hsl(var(--shadow-color))] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 bg-background space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-muted border-4 border-border flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
                    <ShoppingBag size={48} strokeWidth={2} className="text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-black uppercase mb-6">Your cart is empty.</p>
                  <button 
                    onClick={() => { setIsCartOpen(false); navigate('/products'); }}
                    className="neo-button bg-accent text-accent-foreground"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.variant?.id}`} className="neo-card p-4 flex gap-4 bg-card items-center">
                    <div className="w-24 h-24 bg-muted border-4 border-border flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag size={32} strokeWidth={2} className="text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black uppercase text-lg truncate mb-1">{item.title || item.name}</h4>
                      <p className="font-black text-primary text-xl mb-3">
                        {formatCurrency(item.variant?.price_in_cents || item.price_in_cents || 0)}
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border-4 border-border bg-background">
                          <button 
                            onClick={() => updateQuantity(item.id, item.variant?.id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-1 hover:bg-muted font-black text-lg"
                          >-</button>
                          <span className="px-4 py-1 border-l-4 border-r-4 border-border font-black text-lg w-12 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.variant?.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-muted font-black text-lg"
                          >+</button>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id, item.variant?.id)}
                      className="p-3 border-4 border-border bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors self-start shadow-[2px_2px_0px_0px_hsl(var(--shadow-color))] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                      aria-label="Remove item"
                    >
                      <Trash2 size={20} strokeWidth={3} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t-4 border-border bg-card">
                <div className="flex justify-between items-center mb-6 border-b-4 border-border pb-4">
                  <span className="text-2xl font-black uppercase">Subtotal</span>
                  <span className="text-3xl font-black text-primary">{formatCurrency(getCartTotal())}</span>
                </div>
                
                <div className="flex flex-col gap-4">
                  <button onClick={handleCheckout} className="neo-button bg-accent text-accent-foreground w-full justify-center text-xl uppercase tracking-widest">
                    Checkout <ArrowRight size={24} strokeWidth={3} className="ml-2" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;
