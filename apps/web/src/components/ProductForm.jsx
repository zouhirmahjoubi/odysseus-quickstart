
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const ProductForm = ({ initialData = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    checkout_link: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price || '',
        description: initialData.description || '',
        checkout_link: initialData.checkout_link || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description || !formData.checkout_link) {
      toast.error('All fields are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        price: parseFloat(formData.price),
        status: initialData ? initialData.status : 'active'
      };

      if (initialData?.id) {
        await pb.collection('products').update(initialData.id, dataToSave, { $autoCancel: false });
        toast.success('Product updated successfully!');
      } else {
        await pb.collection('products').create(dataToSave, { $autoCancel: false });
        toast.success('Product added successfully!');
        setFormData({ name: '', price: '', description: '', checkout_link: '' });
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-admin shadow-admin p-6 md:p-8 space-y-6">
      <h3 className="text-2xl font-bold mb-4">{initialData ? 'Edit Product' : 'Add New Product'}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-bold text-black block">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border-admin shadow-admin focus:outline-none focus:shadow-neo-shadow-hover transition-shadow"
            placeholder="e.g., AI Model Pack"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-black block">Price ($ USD) *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-lg">$</span>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full p-3 pl-8 border-admin shadow-admin focus:outline-none focus:shadow-neo-shadow-hover transition-shadow"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-bold text-black block">Stripe/PayPal Checkout Link *</label>
        <input
          type="url"
          name="checkout_link"
          value={formData.checkout_link}
          onChange={handleChange}
          required
          className="w-full p-3 border-admin shadow-admin focus:outline-none focus:shadow-neo-shadow-hover transition-shadow"
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <label className="font-bold text-black block">Product Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-3 border-admin shadow-admin focus:outline-none focus:shadow-neo-shadow-hover transition-shadow resize-y"
          placeholder="Describe the product..."
        />
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto px-8 py-4 bg-[#BBF7D0] border-admin shadow-admin font-bold text-lg disabled:opacity-50"
        whileHover={{ y: 2, x: 2, boxShadow: '2px 2px 0px 0px #000000' }}
        whileTap={{ y: 4, x: 4, boxShadow: '0px 0px 0px 0px #000000' }}
      >
        {isSubmitting ? 'Processing...' : (initialData ? '💾 Update Product' : '+ Add Product')}
      </motion.button>
    </form>
  );
};

export default ProductForm;
