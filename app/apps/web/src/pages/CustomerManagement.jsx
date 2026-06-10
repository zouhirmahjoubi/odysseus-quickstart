
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, UserCircle, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await pb.collection('users').getFullList({ sort: '-created', $autoCancel: false });
        setCustomers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet><title>Customers - Admin</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-3 border-black pb-4 gap-4">
        <h1 className="text-4xl font-black space-grotesk">Customers</h1>
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search name or email..." 
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
                <th className="p-4 font-black">Customer</th>
                <th className="p-4 font-black">Email</th>
                <th className="p-4 font-black">Registered</th>
                <th className="p-4 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center font-bold text-gray-500">No customers found.</td></tr>
              ) : (
                filtered.map(cust => (
                  <tr key={cust.id} className="border-b border-dashed border-gray-300 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-black flex items-center justify-center overflow-hidden">
                        {cust.avatar ? <img src={pb.files.getUrl(cust, cust.avatar)} alt="Avatar" className="w-full h-full object-cover"/> : <UserCircle size={20} />}
                      </div>
                      {cust.name || 'Unknown User'}
                    </td>
                    <td className="p-4 font-medium text-sm">{cust.email}</td>
                    <td className="p-4 font-medium text-sm">{new Date(cust.created).toLocaleDateString()}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button className="p-2 neo-border bg-white hover:bg-[hsl(var(--primary))] transition-colors" title="Edit/View">
                        <Edit size={16} />
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

export default CustomerManagement;
