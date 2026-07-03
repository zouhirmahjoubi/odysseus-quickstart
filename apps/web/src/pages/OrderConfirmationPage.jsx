
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle, Package, Truck, Calendar } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { formatCurrency } from '@/api/EcommerceApi.js';
import PageTransition from '@/components/PageTransition.jsx';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await apiServerClient.fetch(`/ecommerce/orders/${orderId}`);
        if (!res.ok) throw new Error('Order not found');
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-black border-t-[hsl(var(--primary-accent))] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="neo-card bg-[#ffe5e5] p-8 text-black">
          <h1 className="text-3xl font-black space-grotesk mb-4">Order Not Found</h1>
          <p className="font-bold mb-8">We couldn't retrieve the details for order {orderId}.</p>
          <button onClick={() => navigate('/odysseus-shop')} className="neo-button bg-black text-white">Return to Store</button>
        </div>
      </div>
    );
  }

  // Handle items format correctly based on Express schema
  const items = Array.isArray(order.items) ? order.items : [];
  
  // Provide safe subtotal format assuming stored in dollars directly by express
  const formatDollars = (amt) => `$${Number(amt || 0).toFixed(2)}`;

  return (
    <PageTransition>
      <Helmet><title>Order Confirmed - OdysseusAI</title></Helmet>
      
      <div className="max-w-4xl mx-auto py-12 px-4 md:px-8 w-full">
        <div className="neo-card bg-[hsl(var(--primary-accent))] p-8 md:p-12 mb-8 flex flex-col items-center text-center text-black">
          <CheckCircle size={64} className="mb-6" />
          <h1 className="text-4xl md:text-5xl font-black space-grotesk mb-4">Payment Successful!</h1>
          <p className="text-lg md:text-xl font-bold max-w-lg">
            Thank you for your purchase. Your premium blueprints are ready for deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Order Details */}
          <div className="neo-card bg-white dark:bg-black p-6 md:p-8">
            <h2 className="text-2xl font-black space-grotesk mb-6 border-b-[3px] border-black pb-4 text-black dark:text-white flex items-center gap-3">
              <Package size={24} /> Order #{order.orderId.split('-')[1] || order.orderId}
            </h2>
            
            <div className="space-y-4 font-bold text-black dark:text-white">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span>{item.quantity}x {item.productId}</span>
                  <span>{formatDollars(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 space-y-2 font-black text-black dark:text-white text-lg">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatDollars(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatDollars(order.tax)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatDollars(order.shipping)}</span></div>
              <div className="flex justify-between text-2xl pt-4 mt-4 border-t-[3px] border-black text-[hsl(var(--accent))]">
                <span>Total Paid</span><span>{formatDollars(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="neo-card bg-[hsl(var(--pale-yellow))] dark:bg-[hsl(var(--card-bg))] p-6 md:p-8 text-black dark:text-white">
            <h2 className="text-2xl font-black space-grotesk mb-6 border-b-[3px] border-black pb-4 flex items-center gap-3">
              <Truck size={24} /> Shipping Details
            </h2>
            
            <div className="font-bold space-y-2 mb-8 text-lg">
              <p>{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
              <p className="mt-4 opacity-80 break-words">{order.shippingAddress?.email}</p>
            </div>

            <div className="bg-white dark:bg-black border-[3px] border-black p-4 flex items-center gap-4">
              <Calendar size={32} className="text-[hsl(var(--primary-accent))]" />
              <div>
                <p className="font-black text-sm uppercase">Estimated Delivery</p>
                <p className="font-bold text-lg">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center w-full flex justify-center">
          <button onClick={() => navigate('/odysseus-shop')} className="neo-button bg-black text-white px-8 py-4 text-lg w-full md:w-auto">
            Continue Shopping
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default OrderConfirmationPage;
