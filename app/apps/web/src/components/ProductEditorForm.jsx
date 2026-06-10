
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';

const ProductEditorForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    description: '',
    stock: '',
    discount_price: '',
    category: '',
    tags: [],
    variants: '',
    specifications: '',
    meta_description: '',
    keywords: '',
    status: 'active',
    checkout_link: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        price: product.price || '',
        description: product.description || '',
        stock: product.stock || '',
        discount_price: product.discount_price || '',
        category: product.category || '',
        tags: product.tags || [],
        variants: product.variants || '',
        specifications: product.specifications || '',
        meta_description: product.meta_description || '',
        keywords: product.keywords || '',
        status: product.status || 'active',
        checkout_link: product.checkout_link || ''
      });
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const records = await pb.collection('categories').getFullList({ $autoCancel: false });
      setCategories(records);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseFloat(formData.stock),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null
      };

      let result;
      if (product) {
        result = await pb.collection('products').update(product.id, submitData, { $autoCancel: false });
        toast.success('Product updated successfully');
      } else {
        result = await pb.collection('products').create(submitData, { $autoCancel: false });
        toast.success('Product created successfully');
      }
      onSave(result);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[hsl(var(--card))] border-[3px] border-[hsl(var(--border-color))] shadow-[8px_8px_0px_0px_hsl(var(--border-color))] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[hsl(var(--card))] border-b-[3px] border-[hsl(var(--border-color))] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black">{product ? 'Edit Product' : 'Create New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[hsl(var(--muted))] transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleNameChange}
                required
                className="neo-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="neo-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
                className="neo-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount_price">Discount Price</Label>
              <Input
                id="discount_price"
                type="number"
                step="0.01"
                value={formData.discount_price}
                onChange={(e) => setFormData(prev => ({ ...prev, discount_price: e.target.value }))}
                className="neo-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                required
                className="neo-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="neo-input">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="neo-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkout_link">Checkout Link *</Label>
              <Input
                id="checkout_link"
                value={formData.checkout_link}
                onChange={(e) => setFormData(prev => ({ ...prev, checkout_link: e.target.value }))}
                required
                className="neo-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {['featured', 'sale', 'new', 'bestseller'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 border-[3px] border-[hsl(var(--border-color))] font-bold transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-[hsl(var(--primary))] text-black'
                      : 'bg-[hsl(var(--card))] hover:bg-[hsl(var(--muted))]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
              className="neo-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specifications">Specifications (JSON)</Label>
            <Textarea
              id="specifications"
              value={formData.specifications}
              onChange={(e) => setFormData(prev => ({ ...prev, specifications: e.target.value }))}
              rows={3}
              placeholder='{"CPU": "Intel i7", "RAM": "16GB"}'
              className="neo-input font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="variants">Variants (JSON)</Label>
            <Textarea
              id="variants"
              value={formData.variants}
              onChange={(e) => setFormData(prev => ({ ...prev, variants: e.target.value }))}
              rows={3}
              placeholder='[{"size": "Small", "price": 99}, {"size": "Large", "price": 149}]'
              className="neo-input font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
              rows={2}
              className="neo-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
              placeholder="ai, hardware, gpu"
              className="neo-input"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="neo-button bg-[hsl(var(--primary))] text-black flex-1">
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </Button>
            <Button type="button" onClick={onClose} className="neo-button bg-[hsl(var(--muted))]">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditorForm;
