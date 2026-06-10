
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Eye, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const BlogAdminPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('blog_posts').getFullList({
        sort: '-created',
        expand: 'category',
        $autoCancel: false
      });
      setPosts(records);
    } catch (err) {
      toast.error(err.message || 'Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    try {
      await pb.collection('blog_posts').delete(id, { $autoCancel: false });
      toast.success('Post successfully deleted.');
      fetchPosts();
    } catch (err) {
      toast.error(err.message || 'Failed to delete post.');
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = (p.title && p.title.toLowerCase().includes(search.toLowerCase())) || 
                          (p.author && p.author.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500 w-full">
      <Helmet><title>Blog Administration | OdysseusAI</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 neo-card bg-card p-6 w-full">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Transmission Logs</h1>
          <p className="text-muted-foreground font-bold mt-1">Manage, edit, and publish blog articles.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="neo-input py-2 px-3 text-sm font-bold min-h-[44px]"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text" 
              placeholder="Search by title or author..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="neo-input pl-10 py-2 min-h-[44px] text-sm w-full"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} strokeWidth={3} />
          </div>
          <Link to="/blog/new" className="neo-button bg-accent text-accent-foreground whitespace-nowrap text-sm justify-center flex items-center">
            <Plus size={18} className="mr-2" strokeWidth={3} /> Compose Post
          </Link>
        </div>
      </div>

      <div className="neo-card p-0 overflow-x-auto bg-card w-full">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-primary text-primary-foreground border-b-4 border-border text-xs uppercase tracking-widest">
              <th className="p-4 font-black w-16">Cover</th>
              <th className="p-4 font-black">Title</th>
              <th className="p-4 font-black w-32">Author</th>
              <th className="p-4 font-black w-24">Status</th>
              <th className="p-4 font-black w-32">Date</th>
              <th className="p-4 font-black w-32 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-background">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                 <tr key={i} className="border-b-4 border-border">
                   <td className="p-4"><Skeleton className="h-10 w-10" /></td>
                   <td className="p-4"><Skeleton className="h-6 w-3/4" /></td>
                   <td className="p-4"><Skeleton className="h-6 w-24" /></td>
                   <td className="p-4"><Skeleton className="h-6 w-16" /></td>
                   <td className="p-4"><Skeleton className="h-6 w-24" /></td>
                   <td className="p-4"><Skeleton className="h-8 w-20 ml-auto" /></td>
                 </tr>
              ))
            ) : filteredPosts.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <XCircle size={48} className="mb-4 opacity-20" />
                    <span className="font-black uppercase text-lg">No posts found</span>
                    <span className="font-medium text-sm mt-1">Try a different search or create a new post.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPosts.map(post => (
                <tr key={post.id} className="border-b-4 border-border hover:bg-muted/30 transition-colors last:border-b-0">
                  <td className="p-4">
                    {post.featured_image ? (
                      <div className="w-10 h-10 rounded border-2 border-border overflow-hidden bg-white">
                        <img src={pb.files.getUrl(post, post.featured_image)} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded border-2 border-border bg-card flex items-center justify-center">
                        <ImageIcon size={16} className="text-muted-foreground opacity-50" />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-black truncate max-w-sm mb-1">{post.title}</div>
                    <div className="text-xs font-bold text-muted-foreground font-mono flex items-center gap-2">
                      {post.expand?.category && (
                        <span className="bg-muted px-1.5 py-0.5 rounded border border-border uppercase">
                          {post.expand.category.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1"><Eye size={12} /> {post.view_count || 0} views</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-sm truncate">{post.author || 'System'}</td>
                  <td className="p-4">
                    {post.status === 'published' ? (
                      <span className="bg-secondary text-secondary-foreground border-2 border-border px-2 py-1 rounded text-[10px] font-black uppercase shadow-sm inline-flex items-center gap-1">
                        <CheckCircle size={10} strokeWidth={3} /> Published
                      </span>
                    ) : (
                      <span className="bg-muted text-muted-foreground border-2 border-border px-2 py-1 rounded text-[10px] font-black uppercase shadow-sm inline-block">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-medium text-xs text-muted-foreground">
                    {new Date(post.publication_date || post.created).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        to={`/blog/${post.slug}`} 
                        className="w-8 h-8 flex items-center justify-center bg-card border-2 border-border rounded hover:bg-accent hover:text-accent-foreground transition-all shadow-sm hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-px" 
                        title="View Post"
                        target="_blank"
                      >
                        <Eye size={14} strokeWidth={2.5} />
                      </Link>
                      <Link 
                        to={`/blog/edit/${post.id}`} 
                        className="w-8 h-8 flex items-center justify-center bg-card border-2 border-border rounded hover:bg-primary transition-all shadow-sm hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-px" 
                        title="Edit Post"
                      >
                        <Edit size={14} strokeWidth={2.5} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(post.id)} 
                        className="w-8 h-8 flex items-center justify-center bg-card border-2 border-border rounded hover:bg-destructive hover:text-destructive-foreground transition-all shadow-sm hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-px" 
                        title="Delete Post"
                      >
                        <Trash2 size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogAdminPage;
