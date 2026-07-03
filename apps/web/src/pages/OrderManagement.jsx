
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Edit, Eye, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await pb.collection('orders').getFullList({ sort: '-created', $autoCancel: false });
        setOrders(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => 
    o.orderId?.toLowerCase().includes(search.toLowerCase()) || 
    o.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet><title>Order Management - Admin</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-3 border-black pb-4 gap-4">
        <h1 className="text-4xl font-black space-grotesk">Orders</h1>
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search order ID or status..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="neo-input pl-10 py-2"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
        </div>
      </div>

      <div className="neo-card p-0 overflow-x-auto bg-white">
        {loading ? (
          <div className="p-8 text-center font-bold">Loading records...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[hsl(var(--background))] border-b-3 border-black text-sm uppercase tracking-wide">
                <th className="p-4 font-black">Order ID</th>
                <th className="p-4 font-black">Date</th>
                <th className="p-4 font-black">Total</th>
                <th className="p-4 font-black">Status</th>
                <th className="p-4 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center font-bold text-gray-500">No orders found.</td></tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="border-b border-dashed border-gray-300 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold">{order.orderId || order.id.slice(0,8)}</td>
                    <td className="p-4 font-medium text-sm">{new Date(order.created).toLocaleDateString()}</td>
                    <td className="p-4 font-black">${order.total?.toFixed(2) || '0.00'}</td>
                    <td className="p-4">
                      <span className={`neo-badge ${order.status === 'completed' ? 'bg-[hsl(var(--primary))]' : 'bg-yellow-200'}`}>
                        {order.status?.toUpperCase() || 'COMPLETED'}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button onClick={() => navigate(`/odysseus-admin/orders/${order.id}`)} className="p-2 neo-border bg-white hover:bg-[hsl(var(--primary))] transition-colors" title="View Details">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
