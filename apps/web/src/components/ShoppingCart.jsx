
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
    navigate('/odysseus-checkout');
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
            className="fixed top-0 right-0 w-[450px] max-w-[100vw] h-[100dvh] bg-[#0A0A0C]/95 backdrop-blur-[20px] border-l border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-[90] flex flex-col text-white font-rounded"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold uppercase flex items-center gap-3 text-white">
                <ShoppingBag size={22} className="text-[#E73A5A]" /> My Cart
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 bg-transparent space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                    <ShoppingBag size={36} className="text-gray-400" />
                  </div>
                  <p className="text-lg font-bold uppercase text-gray-300 mb-6">Your cart is empty.</p>
                  <button 
                    onClick={() => { setIsCartOpen(false); navigate('/odysseus-Launch-Kit'); }}
                    className="bg-[#E73A5A] text-white px-8 py-3 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(231, 58, 90, 0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.variant?.id}`} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-center hover:border-white/20 transition-all">
                    <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag size={24} className="text-gray-500" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="font-bold text-sm text-white truncate mb-1">{item.title || item.name}</h4>
                      <p className="font-black text-[#E73A5A] text-base mb-3">
                        {formatCurrency(item.variant?.price_in_cents || item.price_in_cents || 0)}
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-white/10 bg-black/20 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.id, item.variant?.id, Math.max(1, item.quantity - 1))}
                            className="px-2.5 py-1 hover:bg-white/5 font-bold text-sm text-gray-400 hover:text-white transition-colors"
                          >-</button>
                          <span className="px-3 py-1 border-l border-r border-white/10 font-bold text-sm w-10 text-center text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.variant?.id, item.quantity + 1)}
                            className="px-2.5 py-1 hover:bg-white/5 font-bold text-sm text-gray-400 hover:text-white transition-colors"
                          >+</button>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id, item.variant?.id)}
                      className="p-2.5 rounded-xl border border-white/10 hover:border-red-500/30 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors self-start"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-white/5">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base font-bold uppercase text-gray-400">Subtotal</span>
                  <span className="text-2xl font-black text-[#E73A5A]">{formatCurrency(getCartTotal())}</span>
                </div>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={handleCheckout} 
                    className="w-full bg-[#E73A5A] hover:bg-[#E73A5A]/95 text-white py-3.5 rounded-full font-bold transition-all text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(231, 58, 90, 0.3)]"
                  >
                    Checkout <ArrowRight size={16} strokeWidth={2.5} className="ml-1" />
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
