
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', email: '', verified: false
  });

  useEffect(() => {
    pb.collection('users').getOne(id, { $autoCancel: false })
      .then(record => {
        setFormData({
          name: record.name || '',
          email: record.email || '',
          verified: record.verified || false
        });
      }).catch(err => toast.error('Failed to load user'));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await pb.collection('users').update(id, formData, { $autoCancel: false });
      toast.success('User updated');
      navigate('/odysseus-zouhirmahjoubi/users');
    } catch (err) {
      toast.error('Operation failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <Helmet><title>Edit User | Admin</title></Helmet>

      <div className="neo-card p-8">
        <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-border pb-4">Edit User</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-black uppercase mb-2">Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="neo-input py-3" />
          </div>
          <div>
            <label className="block font-black uppercase mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="neo-input py-3" required />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="verified" checked={formData.verified} onChange={handleChange} id="verified" className="w-5 h-5 border-4 border-border rounded-sm accent-primary cursor-pointer" />
            <label htmlFor="verified" className="font-bold cursor-pointer">Email Verified</label>
          </div>
          <div className="flex gap-4 pt-4 border-t-4 border-border">
            <button type="submit" className="neo-button bg-primary text-primary-foreground">Save User</button>
            <button type="button" onClick={() => navigate('/odysseus-zouhirmahjoubi/users')} className="neo-button bg-card">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditPage;
