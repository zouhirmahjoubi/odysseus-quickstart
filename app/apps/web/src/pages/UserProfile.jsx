
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { User, Settings, Package, MapPin, CreditCard, LogOut, Download } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [ordersRes, addrRes] = await Promise.all([
          pb.collection('orders').getFullList({ filter: `userId="${user.id}"`, sort: '-created', $autoCancel: false }),
          pb.collection('addresses').getFullList({ filter: `userId="${user.id}"`, sort: '-created', $autoCancel: false })
        ]);
        setOrders(ordersRes);
        setAddresses(addrRes);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const TABS = [
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'settings', label: 'Account Settings', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet><title>My Profile - OdysseusAI</title></Helmet>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Profile Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
          <div className="neo-card bg-[hsl(var(--primary))] text-center py-8">
            <div className="w-24 h-24 mx-auto neo-border bg-white rounded-full flex items-center justify-center mb-4 overflow-hidden shadow-[4px_4px_0px_0px_#000000]">
              {user.avatar ? (
                <img src={pb.files.getUrl(user, user.avatar)} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-black" />
              )}
            </div>
            <h1 className="text-2xl font-black space-grotesk">{user.name || 'User'}</h1>
            <p className="font-bold opacity-80">{user.email}</p>
            <div className="mt-4 inline-block bg-black text-white px-3 py-1 font-bold text-xs neo-border">
              MEMBER SINCE {new Date(user.created).getFullYear()}
            </div>
          </div>

          <div className="neo-card p-4 space-y-2">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-bold text-sm neo-border transition-all ${activeTab === tab.id ? 'bg-black text-white shadow-[2px_2px_0px_0px_#BBF7D0]' : 'bg-white hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000]'}`}
                >
                  <Icon size={18} /> {tab.label}
                </button>
              );
            })}
            <div className="my-2 border-b-3 border-black"></div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 font-bold text-sm neo-border bg-[#ffe5e5] text-red-600 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000]">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 neo-card bg-white min-h-[500px]">
          {loading ? (
            <div className="h-full flex items-center justify-center font-bold">Loading...</div>
          ) : (
            <>
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-black space-grotesk mb-6 border-b-3 border-black pb-4">Order History</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="font-bold text-lg mb-4">You haven't placed any orders yet.</p>
                      <button onClick={() => navigate('/shop')} className="neo-button-primary">Start Shopping</button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="neo-border p-4 bg-[hsl(var(--background))] hover:bg-white transition-colors">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b-2 border-dashed border-gray-300">
                            <div>
                              <p className="font-black text-lg">Order #{order.orderId || order.id.slice(0,8)}</p>
                              <p className="font-bold text-sm text-gray-500">{new Date(order.created).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`neo-badge ${order.status === 'completed' || order.status === 'delivered' ? 'bg-[hsl(var(--primary))]' : 'bg-yellow-200'}`}>
                                {order.status?.toUpperCase() || 'COMPLETED'}
                              </span>
                              <span className="font-black text-xl">${order.total?.toFixed(2) || '0.00'}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button className="neo-button bg-black text-white text-xs py-2 px-4" onClick={() => navigate(`/order-confirmation/${order.id}`)}>
                              View Details
                            </button>
                            <button className="neo-button bg-white text-black text-xs py-2 px-4" onClick={() => toast('Invoice download started')}>
                              <Download size={14} className="mr-2 inline" /> Invoice
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <div className="flex justify-between items-center mb-6 border-b-3 border-black pb-4">
                    <h2 className="text-2xl font-black space-grotesk">Saved Addresses</h2>
                    <button className="neo-button-primary py-2 px-4 text-sm" onClick={() => toast.info('Add Address form coming soon')}>+ Add New</button>
                  </div>
                  {addresses.length === 0 ? (
                    <p className="font-bold py-8 text-center text-gray-500">No saved addresses.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map(addr => (
                        <div key={addr.id} className="neo-border p-4 relative">
                          {addr.isDefault && <span className="absolute top-2 right-2 neo-badge bg-[hsl(var(--primary))]">DEFAULT</span>}
                          <p className="font-black mb-2">{addr.type === 'billing' ? 'Billing' : 'Shipping'} Address</p>
                          <p className="font-medium text-sm">{addr.street}</p>
                          <p className="font-medium text-sm">{addr.city}, {addr.state} {addr.zipCode}</p>
                          <p className="font-medium text-sm">{addr.country}</p>
                          <div className="mt-4 flex gap-2">
                            <button className="text-sm font-bold underline hover:text-[hsl(var(--primary))]">Edit</button>
                            <button className="text-sm font-bold text-red-600 underline">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'payment' && (
                <div>
                  <h2 className="text-2xl font-black space-grotesk mb-6 border-b-3 border-black pb-4">Payment Methods</h2>
                  <div className="text-center py-12">
                    <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-bold text-lg mb-4">No saved payment methods.</p>
                    <button className="neo-button bg-black text-white" onClick={() => toast.info('Stripe portal integration pending')}>Add Payment Method</button>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-black space-grotesk mb-6 border-b-3 border-black pb-4">Account Settings</h2>
                  <div className="space-y-6 max-w-md">
                    <div>
                      <label className="block font-bold mb-2">Full Name</label>
                      <input type="text" className="neo-input" defaultValue={user.name} />
                    </div>
                    <div>
                      <label className="block font-bold mb-2">Email Address</label>
                      <input type="email" className="neo-input" defaultValue={user.email} disabled />
                      <p className="text-xs font-bold text-gray-500 mt-1">Email changes require verification.</p>
                    </div>
                    <button className="neo-button-primary mt-4" onClick={() => toast.success('Profile updated')}>Save Changes</button>
                    
                    <div className="border-t-3 border-black pt-6 mt-8">
                      <h3 className="font-black text-red-600 mb-4">Danger Zone</h3>
                      <button className="neo-button bg-red-600 text-white" onClick={() => toast.error('Contact support to delete account')}>Delete Account</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
