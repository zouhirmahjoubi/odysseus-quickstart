
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', price: 0, stock: 100, status: 'active', checkout_link: '#'
  });

  useEffect(() => {
    if (!isNew) {
      pb.collection('products').getOne(id, { $autoCancel: false })
        .then(record => {
          setFormData({
            name: record.name,
            slug: record.slug,
            description: record.description,
            price: record.price,
            stock: record.stock,
            status: record.status,
            checkout_link: record.checkout_link
          });
        }).catch(err => toast.error('Failed to load product'));
    }
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name' && isNew) {
      setFormData(prev => ({
        ...prev, 
        name: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mock category if required by DB schema (using first category or random ID)
      const submitData = { ...formData, category: 'pbc_5055566043' };
      if (isNew) {
        await pb.collection('products').create(submitData, { $autoCancel: false });
        toast.success('Product created');
      } else {
        await pb.collection('products').update(id, formData, { $autoCancel: false });
        toast.success('Product updated');
      }
      navigate('/zouhirmahjoubi/products');
    } catch (err) {
      toast.error('Operation failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Helmet><title>{isNew ? 'New Product' : 'Edit Product'} | Admin</title></Helmet>

      <div className="neo-card p-8">
        <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-border pb-4">{isNew ? 'Create Product' : 'Edit Product'}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-black uppercase mb-2">Name</label>
              <input name="name" value={formData.name} onChange={handleChange} className="neo-input py-3" required />
            </div>
            <div>
              <label className="block font-black uppercase mb-2">Slug</label>
              <input name="slug" value={formData.slug} onChange={handleChange} className="neo-input py-3" required />
            </div>
            <div>
              <label className="block font-black uppercase mb-2">Price ($)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="neo-input py-3" required />
            </div>
            <div>
              <label className="block font-black uppercase mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="neo-input py-3 cursor-pointer">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-black uppercase mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="neo-input py-3 min-h-[150px]" required />
          </div>
          <div className="flex gap-4 pt-4 border-t-4 border-border">
            <button type="submit" className="neo-button bg-primary text-primary-foreground">Save Product</button>
            <button type="button" onClick={() => navigate('/zouhirmahjoubi/products')} className="neo-button bg-card">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditPage;
