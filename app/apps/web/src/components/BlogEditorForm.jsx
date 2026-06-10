
import React, { useState, useEffect } from 'react';
import { Save, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';

const BlogEditorForm = ({ initialData, onSuccess, onCancel }) => {
  const { currentAdmin } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [errorDetails, setErrorDetails] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    author: currentAdmin?.name || 'Admin',
    category: '',
    tags: [],
    excerpt: '',
    content: '',
    status: 'draft',
    publication_date: '',
    read_time: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchRelations = async () => {
      try {
        const [cats, tgs] = await Promise.all([
          pb.collection('blog_categories').getFullList({ sort: 'name', $autoCancel: false }),
          pb.collection('blog_tags').getFullList({ sort: 'name', $autoCancel: false })
        ]);
        
        if (isMounted) {
          setCategories(cats);
          setAvailableTags(tgs);

          if (!initialData && cats.length > 0) {
            setFormData(prev => ({ ...prev, category: cats[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories/tags:", err);
        toast.error("Failed to load categories and tags.");
      }
    };
    fetchRelations();

    return () => {
      isMounted = false;
    };
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        author: initialData.author || currentAdmin?.name || 'Admin',
        category: initialData.category || '',
        tags: initialData.tags || [],
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        status: initialData.status || 'draft',
        publication_date: initialData.publication_date ? new Date(initialData.publication_date).toISOString().split('T')[0] : '',
        read_time: initialData.read_time || 0,
      });
      
      if (initialData.featured_image) {
        setImagePreview(pb.files.getUrl(initialData, initialData.featured_image));
      }
    }
  }, [initialData, currentAdmin]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      let finalValue = value;
      if (type === 'number') {
        finalValue = value === '' ? 0 : parseInt(value, 10);
      }
      
      const updates = { ...prev, [name]: finalValue };
      if (name === 'title' && !initialData) {
        updates.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return updates;
    });
  };

  const handleTagChange = (e) => {
    const options = e.target.options;
    const selectedTags = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedTags.push(options[i].value);
      }
    }
    setFormData(prev => ({ ...prev, tags: selectedTags }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorDetails(null);

    if (!formData.title || !formData.content || !formData.slug || !formData.category || !formData.author) {
      toast.error('Please fill in all required fields (Title, Slug, Content, Category, Author).');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('slug', formData.slug);
      data.append('content', formData.content);
      data.append('excerpt', formData.excerpt);
      data.append('author', formData.author);
      data.append('status', formData.status);
      data.append('category', formData.category);
      
      if (formData.read_time > 0) {
        data.append('read_time', formData.read_time.toString());
      }
      
      if (formData.publication_date) {
        const pubDate = new Date(formData.publication_date);
        data.append('publication_date', pubDate.toISOString());
      } else {
        data.append('publication_date', '');
      }

      formData.tags.forEach(tagId => {
        data.append('tags', tagId);
      });

      if (currentAdmin?.id) {
        data.append('created_by', currentAdmin.id);
      }

      if (imageFile) {
        data.append('featured_image', imageFile);
      }

      if (initialData?.id) {
        await pb.collection('blog_posts').update(initialData.id, data, { $autoCancel: false });
        toast.success('Blog post updated successfully!');
      } else {
        await pb.collection('blog_posts').create(data, { $autoCancel: false });
        toast.success('Blog post created successfully!');
      }
      onSuccess();
    } catch (error) {
      console.error('PocketBase submission error:', error);
      let errorMessage = error.message || 'Failed to save post.';
      let details = null;

      if (error.data && error.data.data) {
        details = Object.entries(error.data.data).map(([field, err]) => ({
          field,
          message: err.message
        }));
        errorMessage = `Validation failed. Check the highlighted fields.`;
        setErrorDetails(details);
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {errorDetails && (
        <div className="bg-[hsl(var(--destructive))]/10 border-[3px] border-[hsl(var(--destructive))] p-4 mb-6 shadow-[4px_4px_0px_0px_hsl(var(--destructive))]">
          <div className="flex items-center gap-2 text-[hsl(var(--destructive))] font-black mb-2 uppercase tracking-wide">
            <AlertCircle size={20} strokeWidth={3} />
            <span>Submission Failed</span>
          </div>
          <ul className="list-disc list-inside text-sm text-[hsl(var(--destructive))] font-bold ml-2 space-y-1">
            {errorDetails.map((err, idx) => (
              <li key={idx}><span className="uppercase tracking-wider">{err.field}</span>: {err.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <label className="font-black uppercase text-sm tracking-wide">Title *</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              className="neo-input w-full"
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-black uppercase text-sm tracking-wide">Content *</label>
            <textarea 
              name="content" 
              value={formData.content} 
              onChange={handleChange} 
              className="neo-input w-full min-h-[400px] font-mono text-sm"
              placeholder="Write your post content here (HTML/Markdown supported)..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="font-black uppercase text-sm tracking-wide">Excerpt</label>
            <textarea 
              name="excerpt" 
              value={formData.excerpt} 
              onChange={handleChange} 
              className="neo-input w-full min-h-[100px]"
              placeholder="Short summary for the blog card..."
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="neo-card p-6 bg-muted/30">
            <h3 className="font-black uppercase mb-4 border-b-4 border-border pb-2">Publishing</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-black uppercase text-xs tracking-wide">Status *</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange} 
                  className="neo-input w-full py-2"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-black uppercase text-xs tracking-wide">URL Slug *</label>
                <input 
                  type="text" 
                  name="slug" 
                  value={formData.slug} 
                  onChange={handleChange} 
                  className="neo-input w-full py-2 text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="font-black uppercase text-xs tracking-wide">Publication Date</label>
                <input 
                  type="date" 
                  name="publication_date" 
                  value={formData.publication_date} 
                  onChange={handleChange} 
                  className="neo-input w-full py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="neo-card p-6 bg-muted/30">
            <h3 className="font-black uppercase mb-4 border-b-4 border-border pb-2">Metadata</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-black uppercase text-xs tracking-wide">Author *</label>
                <input 
                  type="text" 
                  name="author" 
                  value={formData.author} 
                  onChange={handleChange} 
                  className="neo-input w-full py-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="font-black uppercase text-xs tracking-wide">Category *</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  className="neo-input w-full py-2"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="font-black uppercase text-xs tracking-wide">Tags</label>
                <select 
                  name="tags" 
                  multiple
                  value={formData.tags} 
                  onChange={handleTagChange} 
                  className="neo-input w-full py-2 min-h-[100px]"
                >
                  {availableTags.map(tag => (
                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground font-bold mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>

              <div className="space-y-2">
                <label className="font-black uppercase text-xs tracking-wide">Read Time (Mins)</label>
                <input 
                  type="number" 
                  name="read_time" 
                  value={formData.read_time} 
                  onChange={handleChange} 
                  min="0"
                  className="neo-input w-full py-2"
                />
              </div>
            </div>
          </div>

          <div className="neo-card p-6 bg-muted/30">
            <h3 className="font-black uppercase mb-4 border-b-4 border-border pb-2">Featured Image</h3>
            <div className="space-y-4">
              {imagePreview && (
                <div className="w-full h-32 border-4 border-border rounded-lg overflow-hidden bg-white">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="neo-button bg-card text-foreground w-full cursor-pointer justify-center">
                <ImageIcon size={18} className="mr-2" /> 
                {imagePreview ? 'Change Image' : 'Upload Image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t-4 border-border">
        <button 
          type="button" 
          onClick={onCancel} 
          disabled={loading}
          className="neo-button bg-card text-foreground"
        >
          <X size={20} className="mr-2" /> Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="neo-button bg-primary text-primary-foreground flex-1 justify-center"
        >
          {loading ? (
            <><Loader2 size={20} className="mr-2 animate-spin" /> Saving...</>
          ) : (
            <><Save size={20} className="mr-2" /> Save Post</>
          )}
        </button>
      </div>
    </form>
  );
};

export default BlogEditorForm;
