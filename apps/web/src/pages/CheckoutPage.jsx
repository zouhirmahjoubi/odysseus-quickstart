
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import apiServerClient from '@/lib/apiServerClient.js';
import NeoBrutalInput from '@/components/NeoBrutalInput.jsx';

const CheckoutPage = () => {
  const { cartItems, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '', email: user?.email || '', street: '', city: '', state: '', zipCode: '', country: 'USA'
  });

  const subtotal = getCartTotal();
  const tax = subtotal * 0.10;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    if (cartItems.length === 0) navigate('/odysseus-shop');
  }, [cartItems, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const items = cartItems.map(item => ({
        productId: item.product?.id || item.id,
        quantity: item.quantity,
        price: (item.variant?.price_in_cents || item.price_in_cents || 0) / 100
      }));

      // Call the Express checkout endpoint to get Stripe Session URL
      const res = await apiServerClient.fetch('/odysseus-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerId: user?.id || 'guest',
          shippingAddress: formData
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize checkout');

      // Use window.open for Stripe Checkout redirect to bypass iframe restrictions
      window.open(data.url, '_blank');
      
      // We assume completion happens via webhook & redirect
      toast.success('Redirecting to secure payment portal...');
      
      // For UX in this demo environment, optionally clear cart if we consider the action "done"
      // Real apps clear cart after success URL return.
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Payment processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-16 px-4 md:px-8 w-full">
      <Helmet><title>Secure Checkout - OdysseusAI</title></Helmet>
      <h1 className="text-3xl md:text-5xl font-black space-grotesk mb-8">Secure Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-2/3">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="neo-card bg-white">
              <h2 className="text-2xl font-black space-grotesk mb-6 border-b-3 border-black pb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="md:col-span-2">
                  <NeoBrutalInput id="name" label="Full Name" required value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="md:col-span-2">
                  <NeoBrutalInput id="email" type="email" label="Email Address" required value={formData.email} onChange={handleInputChange} />
                </div>
                <div className="md:col-span-2">
                  <NeoBrutalInput id="street" label="Street Address" required value={formData.street} onChange={handleInputChange} />
                </div>
                <NeoBrutalInput id="city" label="City" required value={formData.city} onChange={handleInputChange} />
                <div className="grid grid-cols-2 gap-4 w-full">
                  <NeoBrutalInput id="state" label="State" required value={formData.state} onChange={handleInputChange} />
                  <NeoBrutalInput id="zipCode" label="ZIP Code" required value={formData.zipCode} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="neo-card bg-[hsl(var(--secondary))]">
              <h2 className="text-2xl font-black space-grotesk mb-6 border-b-3 border-black pb-4 flex items-center gap-3">
                <CreditCard size={28} /> Payment via Stripe
              </h2>
              <p className="font-bold mb-4 bg-white p-4 neo-border">
                You will be securely redirected to Stripe to complete your purchase.
              </p>
              <div className="flex items-center gap-3 mt-6 text-sm font-bold">
                <ShieldCheck size={20} className="text-green-700" />
                Payments are encrypted and processed securely.
              </div>
            </div>
          </form>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="neo-card sticky top-24 bg-white">
            <h2 className="text-xl font-black space-grotesk mb-6 border-b-3 border-black pb-4">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm font-bold border-b border-dashed border-gray-300 pb-2">
                  <span className="truncate pr-4 flex-1">{item.quantity}x {item.title || item.name}</span>
                  <span>${(((item.variant?.price_in_cents || 0) / 100) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 font-bold border-b-3 border-black pb-6 mb-6">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl font-black space-grotesk">Total</span>
              <span className="text-2xl font-black bg-[hsl(var(--primary))] px-3 py-1 neo-border">
                ${total.toFixed(2)}
              </span>
            </div>
            
            <button type="submit" form="checkout-form" disabled={isProcessing} className="neo-button bg-black text-white w-full text-lg">
              {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`} 
              {!isProcessing && <ArrowRight size={20} className="ml-2" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
