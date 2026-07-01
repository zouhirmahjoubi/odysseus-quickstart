
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Search, X, Check, Eye } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';

// Inline Editor Modal Component
const BlogEditorModal = ({ blog, isOpen, onClose, onSaved }) => {
  const { currentAdmin } = useAdminAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', slug: '', content: '', category: 'Tutorials', author: '', status: 'draft', meta_description: '', featured_image: ''
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        content: blog.content || '',
        category: blog.category || 'Tutorials',
        author: blog.author || currentAdmin?.name || 'Admin',
        status: blog.status || 'draft',
        meta_description: blog.meta_description || '',
        featured_image: blog.featured_image || ''
      });
    } else {
      setFormData({
        title: '', slug: '', content: '', category: 'Tutorials', author: currentAdmin?.name || 'Admin', status: 'draft', meta_description: '', featured_image: ''
      });
    }
  }, [blog, currentAdmin, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title' && !blog) {
      setFormData(prev => ({
        ...prev, 
        title: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        published: formData.status === 'published',
        created_by: currentAdmin?.id
      };

      if (blog) {
        await pb.collection('blogs').update(blog.id, dataToSave, { $autoCancel: false });
        toast.success('Post updated successfully');
      } else {
        await pb.collection('blogs').create(dataToSave, { $autoCancel: false });
        toast.success('Post created successfully');
      }
      onSaved();
    } catch (err) {
      toast.error('Operation failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-card w-full max-w-4xl border-[3px] border-border rounded-xl shadow-[8px_8px_0px_0px_hsl(var(--shadow-color))] flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b-[3px] border-border bg-background">
          <h2 className="text-xl font-black uppercase">{blog ? 'Edit Blog Post' : 'Create Blog Post'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md touch-target transition-colors">
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block font-black uppercase text-sm">Title</label>
              <input name="title" value={formData.title} onChange={handleChange} className="admin-input" required />
            </div>
            <div className="space-y-2">
              <label className="block font-black uppercase text-sm">Slug</label>
              <input name="slug" value={formData.slug} onChange={handleChange} className="admin-input" required />
            </div>
            
            <div className="space-y-2">
              <label className="block font-black uppercase text-sm">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="admin-input cursor-pointer" required>
                <option value="Tutorials">Tutorials</option>
                <option value="System Updates">System Updates</option>
                <option value="AI Engine Setup">AI Engine Setup</option>
                <option value="Security">Security</option>
                <option value="Performance">Performance</option>
                <option value="Case Studies">Case Studies</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block font-black uppercase text-sm">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="admin-input cursor-pointer" required>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-black uppercase text-sm">Excerpt (Meta Description)</label>
            <textarea name="meta_description" value={formData.meta_description} onChange={handleChange} className="admin-input min-h-[80px]" />
          </div>

          <div className="space-y-2">
            <label className="block font-black uppercase text-sm flex items-center gap-2">
              Content (Markdown Supported)
            </label>
            <textarea 
              name="content" 
              value={formData.content} 
              onChange={handleChange} 
              className="admin-input min-h-[300px] font-mono text-sm leading-relaxed" 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="block font-black uppercase text-sm">Featured Image URL</label>
            <input name="featured_image" value={formData.featured_image} onChange={handleChange} className="admin-input" placeholder="https://..." />
          </div>
        </form>

        <div className="p-4 border-t-[3px] border-border bg-muted flex items-center justify-end gap-4 rounded-b-lg">
          <button type="button" onClick={onClose} className="neo-button bg-card text-card-foreground">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="neo-button bg-primary text-primary-foreground">
            {isSubmitting ? 'Saving...' : 'Save Post'} <Check className="ml-2" size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

const BlogManagementPage = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;
  
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let filterStr = '';
      if (filterStatus !== 'all') {
        filterStr = `status="${filterStatus}"`;
      }

      const result = await pb.collection('blogs').getList(page, perPage, { 
        sort: '-created',
        filter: filterStr,
        $autoCancel: false 
      });
      setPosts(result.items);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterStatus]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      try {
        await pb.collection('blogs').delete(id, { $autoCancel: false });
        toast.success('Post deleted successfully');
        fetchPosts();
      } catch (err) {
        toast.error('Failed to delete post');
      }
    }
  };

  const openNewModal = () => {
    setEditingBlog(null);
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const handleModalSaved = () => {
    setIsModalOpen(false);
    fetchPosts();
  };

  const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <Helmet><title>Blog Management | Admin</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border-[3px] border-border p-4 md:p-6 rounded-xl shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground font-bold mt-1 text-sm">Manage publications and content</p>
        </div>
        <button onClick={openNewModal} className="neo-button bg-accent text-accent-foreground w-full sm:w-auto">
          <Plus size={20} className="mr-2" strokeWidth={3} /> Create Post
        </button>
      </div>

      <div className="neo-card bg-card p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" strokeWidth={3} />
            <input 
              type="text" 
              placeholder="Search post titles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input pl-10"
            />
          </div>
          <select 
            value={filterStatus} 
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} 
            className="admin-input md:w-48 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border-[3px] border-border">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-primary text-primary-foreground border-b-[3px] border-border text-sm">
                <th className="p-4 font-black uppercase tracking-wider">Title</th>
                <th className="p-4 font-black uppercase tracking-wider">Author</th>
                <th className="p-4 font-black uppercase tracking-wider">Status</th>
                <th className="p-4 font-black uppercase tracking-wider">Created</th>
                <th className="p-4 font-black uppercase tracking-wider">Views</th>
                <th className="p-4 font-black uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-background">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center font-bold">Loading posts...</td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center font-bold text-muted-foreground">No posts found matching your criteria.</td>
                </tr>
              ) : (
                filteredPosts.map(post => (
                  <tr key={post.id} className="border-b-[3px] border-border hover:bg-muted/50 transition-colors last:border-b-0">
                    <td className="p-4 font-bold max-w-[250px] truncate">{post.title}</td>
                    <td className="p-4 font-semibold text-sm">{post.author}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 font-black text-xs uppercase rounded-full border-2 border-border shadow-sm inline-block ${post.status === 'published' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-muted-foreground text-sm">{new Date(post.created).toLocaleDateString()}</td>
                    <td className="p-4 font-mono font-bold text-sm">
                      <div className="flex items-center gap-2">
                        <Eye size={16} className="text-muted-foreground" />
                        {post.view_count || 0}
                      </div>
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                      <button onClick={() => openEditModal(post)} className="touch-target bg-card border-2 border-border rounded hover:bg-primary transition-colors shadow-sm" title="Edit">
                        <Edit size={18} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="touch-target bg-card border-2 border-border rounded hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm" title="Delete">
                        <Trash2 size={18} strokeWidth={2.5} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="neo-button bg-card py-1 px-4 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-bold text-sm">Page {page} of {totalPages}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="neo-button bg-card py-1 px-4 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <BlogEditorModal 
        blog={editingBlog} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaved={handleModalSaved} 
      />
    </div>
  );
};

export default BlogManagementPage;
