
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Skeleton } from '@/components/ui/skeleton.jsx';

const BlogManagerPage = () => {
  const { currentUser } = useAuth();
  
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category_tags: '',
    content: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchArticles();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('blog_articles').getFullList({
        filter: `author_id = "${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setArticles(records);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (status) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title,
        content: formData.content,
        category_tags: formData.category_tags,
        status: status,
        author_id: currentUser.id
      };

      if (editingId) {
        await pb.collection('blog_articles').update(editingId, payload, { $autoCancel: false });
        toast.success(status === 'published' ? 'Article updated and live!' : 'Draft updated.');
      } else {
        await pb.collection('blog_articles').create(payload, { $autoCancel: false });
        toast.success(status === 'published' ? 'Article published live!' : 'Draft saved.');
      }

      // Reset form on successful save
      setFormData({ title: '', category_tags: '', content: '' });
      setEditingId(null);
      fetchArticles();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save article');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (article) => {
    setFormData({
      title: article.title,
      category_tags: article.category_tags || '',
      content: article.content
    });
    setEditingId(article.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnpublish = async (id) => {
    try {
      await pb.collection('blog_articles').delete(id, { $autoCancel: false });
      toast.success('Article unpublished and removed.');
      
      if (editingId === id) {
        setFormData({ title: '', category_tags: '', content: '' });
        setEditingId(null);
      }
      fetchArticles();
    } catch (err) {
      console.error(err);
      toast.error('Failed to unpublish article');
    }
  };

  const getCategoryBadgeStyle = (tags) => {
    const t = (tags || '').toLowerCase();
    if (t.includes('hardware')) return 'bg-secondary text-secondary-foreground';
    if (t.includes('llm')) return 'bg-primary text-primary-foreground';
    if (t.includes('ai tool')) return 'bg-accent text-accent-foreground';
    return 'bg-muted text-muted-foreground';
  };

  if (!currentUser) {
    return (
      <div className="max-w-5xl mx-auto mt-8 pb-20">
        <Helmet><title>Blog Manager | OdysseusAI</title></Helmet>
        <div className="neo-card bg-accent text-accent-foreground p-12 text-center flex flex-col items-center">
          <h1 className="text-4xl font-black uppercase mb-4">Access Denied</h1>
          <p className="text-xl font-bold mb-8">Please log in to access the Blog Manager workspace.</p>
          <Link to="/login" className="neo-btn bg-card text-card-foreground px-8 py-4 text-xl">
            Log In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 pb-20">
      <Helmet>
        <title>Blog Manager | OdysseusAI</title>
      </Helmet>

      <div className="mb-12">
        <div className="inline-block bg-accent text-accent-foreground border-4 border-border px-4 py-1 font-black uppercase tracking-widest mb-6 shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
          Creator Workspace
        </div>
        <h1 className="text-5xl md:text-6xl font-black uppercase leading-none mb-6">
          Blog Manager
        </h1>
        <p className="text-xl font-semibold max-w-3xl text-foreground/80">
          Draft, publish, and manage your technical insights and hardware guides for the community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT COLUMN: Editor */}
        <div className="neo-card bg-muted/30 border-none shadow-none p-0 space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2">
            {editingId ? 'Edit Article' : 'Draft New Article'}
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-black uppercase mb-2">Article Title</label>
              <input 
                type="text" 
                className="neo-input"
                placeholder="Enter article title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-lg font-black uppercase mb-2">Category Tags</label>
              <input 
                type="text" 
                className="neo-input"
                placeholder="e.g., AI Tools, Hardware, Tutorials"
                value={formData.category_tags}
                onChange={(e) => setFormData({ ...formData, category_tags: e.target.value })}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-lg font-black uppercase mb-2">Content Editor</label>
              <textarea 
                className="neo-input min-h-[400px] resize-y leading-relaxed font-mono text-base"
                placeholder="## Start writing your markdown content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                disabled={submitting}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => handleSave('draft')}
                disabled={submitting}
                className="neo-btn flex-1 bg-card text-card-foreground px-6 py-4 text-lg"
              >
                Save Draft
              </button>
              <button 
                onClick={() => handleSave('published')}
                disabled={submitting}
                className="neo-btn flex-1 bg-accent text-accent-foreground px-6 py-4 text-lg shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))] hover:shadow-[6px_6px_0px_0px_hsl(var(--shadow-color))]"
              >
                Publish Live 🚀
              </button>
            </div>
            
            {editingId && (
              <button 
                onClick={() => { setEditingId(null); setFormData({ title: '', category_tags: '', content: '' }); }}
                disabled={submitting}
                className="w-full text-center font-bold underline decoration-2 hover:text-accent py-2"
              >
                Cancel Editing
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Published Insights */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Published Insights</h2>
          
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="border-4 border-border bg-card p-6 h-40">
                  <Skeleton className="h-6 w-32 mb-4 bg-muted-foreground/20" />
                  <Skeleton className="h-8 w-3/4 mb-6 bg-muted-foreground/20" />
                  <Skeleton className="h-4 w-full bg-muted-foreground/20" />
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="neo-card bg-card text-center p-12">
              <p className="text-xl font-bold text-muted-foreground">No articles found.</p>
              <p className="mt-2 font-medium">Draft your first article in the workspace.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {articles.map((article) => (
                <div key={article.id} className="border-4 border-border bg-card shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))] p-6 flex flex-col">
                  
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <div className={`inline-block border-[3px] border-border px-3 py-1 text-sm font-black uppercase shadow-[2px_2px_0px_0px_hsl(var(--shadow-color))] ${getCategoryBadgeStyle(article.category_tags)}`}>
                      {article.category_tags || 'Uncategorized'}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-6 leading-tight text-balance">
                    {article.title}
                  </h3>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t-4 border-border">
                    <div className="flex items-center gap-2 font-bold text-lg">
                      {article.status === 'published' ? (
                        <span className="text-green-600 flex items-center gap-2">
                          <span className="h-3 w-3 bg-green-500 rounded-none border-2 border-black inline-block"></span>
                          Live
                        </span>
                      ) : (
                        <span className="text-muted-foreground flex items-center gap-2">
                          <span className="h-3 w-3 bg-muted-foreground rounded-none border-2 border-black inline-block"></span>
                          Draft
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleEdit(article)} 
                        className="font-bold underline decoration-2 hover:text-accent transition-colors"
                      >
                        Edit Post
                      </button>
                      <button 
                        onClick={() => handleUnpublish(article.id)} 
                        className="font-bold underline decoration-2 hover:text-destructive transition-colors"
                      >
                        Unpublish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BlogManagerPage;
