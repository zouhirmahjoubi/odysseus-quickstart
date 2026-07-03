
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Package, ArrowLeft, RefreshCw, Send, DollarSign } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await pb.collection('orders').getOne(id, { $autoCancel: false });
        setOrder(data);
        setStatus(data.status || 'pending');
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch order details');
        navigate('/odysseus-admin/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const handleUpdateStatus = async () => {
    try {
      setIsUpdating(true);
      await pb.collection('orders').update(id, { status }, { $autoCancel: false });
      toast.success('Order status updated');
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefund = async () => {
    if (!window.confirm('Process refund for this order?')) return;
    try {
      setIsUpdating(true);
      const res = await apiServerClient.fetch(`/orders/${id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'admin_action' })
      });
      if (!res.ok) throw new Error('Refund failed via API');
      toast.success('Refund processed successfully');
      setOrder(prev => ({...prev, status: 'refunded'}));
      setStatus('refunded');
    } catch (err) {
      toast.error(err.message || 'Refund processing error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading || !order) return <div className="p-8 text-center font-bold">Loading...</div>;

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Helmet><title>Order #{order.orderId || order.id} - Admin</title></Helmet>
      
      <button onClick={() => navigate('/odysseus-admin/orders')} className="flex items-center font-bold text-sm mb-6 hover:underline">
        <ArrowLeft size={16} className="mr-2" /> Back to Orders
      </button>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-8 border-b-3 border-black pb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black space-grotesk flex items-center gap-3">
            <Package /> Order {order.orderId || order.id.slice(0,8)}
          </h1>
          <p className="font-bold text-gray-500 mt-2">{new Date(order.created).toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="neo-input w-48 py-2">
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'completed'].map(s => (
              <option key={s} value={s}>{s.toUpperCase()}</option>
            ))}
          </select>
          <button onClick={handleUpdateStatus} disabled={isUpdating} className="neo-button-primary py-2 px-4">
            <RefreshCw size={16} className="mr-2" /> Update
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="neo-card bg-white">
            <h2 className="text-xl font-black space-grotesk mb-4 border-b-2 border-black pb-2">Line Items</h2>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-dashed border-gray-300 pb-2 font-bold">
                  <span>{item.quantity}x {item.productId || 'Unknown Item'}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {items.length === 0 && <p className="text-gray-500 italic">No line items recorded.</p>}
            </div>
            <div className="mt-6 font-black text-xl flex justify-between pt-4 border-t-3 border-black">
              <span>Total</span>
              <span>${order.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="neo-card bg-[hsl(var(--background))]">
            <h2 className="text-xl font-black space-grotesk mb-4 border-b-2 border-black pb-2">Customer & Shipping</h2>
            <div className="font-bold space-y-2 text-sm">
              <p className="text-base">{order.shippingAddress?.name || order.customerId || 'Guest'}</p>
              <p>{order.shippingAddress?.email}</p>
              <p className="mt-4">{order.shippingAddress?.address || order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip || order.shippingAddress?.zipCode}</p>
            </div>
          </div>

          <div className="neo-card bg-[#ffe5e5]">
            <h2 className="text-xl font-black space-grotesk mb-4 border-b-2 border-black pb-2 text-red-700">Danger Zone</h2>
            <button onClick={handleRefund} disabled={isUpdating} className="neo-button bg-red-600 text-white w-full py-2 flex items-center justify-center">
              <DollarSign size={16} className="mr-2" /> Process Refund
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
