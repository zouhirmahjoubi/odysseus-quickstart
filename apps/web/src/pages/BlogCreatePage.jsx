
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BlogEditorForm from '@/components/BlogEditorForm.jsx';

const BlogCreatePage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/blog');
  };

  const handleCancel = () => {
    navigate('/admin/blog');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500 w-full">
      <Helmet>
        <title>Create New Blog Post | Admin Portal</title>
      </Helmet>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b-4 border-border pb-6">
        <Link 
          to="/admin/blog" 
          className="neo-icon-box bg-card hover:bg-accent hover:text-accent-foreground"
          aria-label="Back to Management"
        >
          <ArrowLeft size={24} strokeWidth={3} />
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Create New Post</h1>
          <p className="text-muted-foreground font-bold mt-1">Draft and publish new content to your readers.</p>
        </div>
      </div>
      
      <div className="neo-card p-6 md:p-8 bg-card">
        <BlogEditorForm initialData={null} onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default BlogCreatePage;
