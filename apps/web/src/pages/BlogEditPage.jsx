
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import BlogEditorForm from '@/components/BlogEditorForm.jsx';

const BlogEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const record = await pb.collection('blog_posts').getOne(id, { $autoCancel: false });
        setPost(record);
      } catch (err) {
        console.error("Failed to load post:", err);
        setError(true);
        toast.error('Failed to load post. It may have been deleted or you lack permissions.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPost();
    } else {
      setError(true);
      setLoading(false);
    }
  }, [id]);

  const handleSuccess = () => {
    navigate('/odysseus-admin/blog');
  };

  const handleCancel = () => {
    navigate('/odysseus-admin/blog');
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="h-12 w-64 bg-muted neo-card animate-pulse mb-8"></div>
        <div className="h-[600px] w-full bg-muted neo-card animate-pulse"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 w-full flex flex-col items-center justify-center text-center">
        <AlertTriangle size={64} className="text-[hsl(var(--destructive))] mb-6" strokeWidth={2} />
        <h1 className="text-3xl font-black uppercase mb-4">Post Not Found</h1>
        <p className="text-muted-foreground font-bold mb-8 max-w-md">
          The requested blog post could not be located. It might have been deleted or you may have followed a broken link.
        </p>
        <Link to="/odysseus-admin/blog" className="neo-button bg-primary text-primary-foreground">
          Return to Blog Management
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500 w-full">
      <Helmet>
        <title>Edit Blog Post | Admin Portal</title>
      </Helmet>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b-4 border-border pb-6">
        <Link 
          to="/odysseus-admin/blog" 
          className="neo-icon-box bg-card hover:bg-accent hover:text-accent-foreground"
          aria-label="Back to Management"
        >
          <ArrowLeft size={24} strokeWidth={3} />
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Edit Post</h1>
          <p className="text-muted-foreground font-bold mt-1">Update existing content: {post.title}</p>
        </div>
      </div>
      
      <div className="neo-card p-6 md:p-8 bg-card w-full">
        <BlogEditorForm initialData={post} onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default BlogEditPage;
