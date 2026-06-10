
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { toast } from 'sonner';

const BlogForm = ({ initialData = null, onSuccess }) => {
  const { admin } = useAdminAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tutorials',
    content: '',
    featured_image: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Tutorials', 'System Updates', 'AI Engine Setup', 'Security', 'Performance', 'Case Studies'];

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'Tutorials',
        content: initialData.content || '',
        featured_image: initialData.featured_image || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        author: admin.id,
        published: true
      };

      if (initialData?.id) {
        await pb.collection('blogs').update(initialData.id, dataToSave, { $autoCancel: false });
        toast.success('Article updated successfully!');
      } else {
        await pb.collection('blogs').create(dataToSave, { $autoCancel: false });
        toast.success('Article published successfully!');
        setFormData({ title: '', category: 'Tutorials', content: '', featured_image: '' });
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-admin shadow-admin p-6 md:p-8 space-y-6">
      <h3 className="text-2xl font-bold mb-4">{initialData ? 'Edit Article' : 'Create New Article'}</h3>
      
      <div className="space-y-2">
        <label className="font-bold text-black block">Article Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-3 border-admin shadow-admin focus:outline-none focus:shadow-neo-shadow-hover transition-shadow"
          placeholder="Enter article title"
        />
      </div>

      <div className="space-y-2">
        <label className="font-bold text-black block">Category Tags</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-3 border-admin shadow-admin focus:outline-none bg-white appearance-none cursor-pointer"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="font-bold text-black block">Featured Image URL</label>
        <input
          type="text"
          name="featured_image"
          value={formData.featured_image}
          onChange={handleChange}
          className="w-full p-3 border-admin shadow-admin focus:outline-none focus:shadow-neo-shadow-hover transition-shadow"
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <label className="font-bold text-black block">Article Content *</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={8}
          className="w-full p-3 border-admin shadow-admin focus:outline-none focus:shadow-neo-shadow-hover transition-shadow resize-y"
          placeholder="Write your content here..."
        />
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto px-8 py-4 bg-[#BBF7D0] border-admin shadow-admin font-bold text-lg disabled:opacity-50"
        whileHover={{ y: 2, x: 2, boxShadow: '2px 2px 0px 0px #000000' }}
        whileTap={{ y: 4, x: 4, boxShadow: '0px 0px 0px 0px #000000' }}
      >
        {isSubmitting ? 'Processing...' : (initialData ? '💾 Update Article' : '🚀 Publish to odysseusai.ai')}
      </motion.button>
    </form>
  );
};

export default BlogForm;
