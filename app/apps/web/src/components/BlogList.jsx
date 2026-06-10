
import React from 'react';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const BlogList = ({ blogs, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await pb.collection('blogs').delete(id, { $autoCancel: false });
        toast.success('Article deleted');
        onRefresh();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete article');
      }
    }
  };

  const handleTogglePublish = async (blog) => {
    try {
      await pb.collection('blogs').update(blog.id, { published: !blog.published }, { $autoCancel: false });
      toast.success(`Article ${blog.published ? 'unpublished' : 'published'}`);
      onRefresh();
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error('Failed to update status');
    }
  };

  if (!blogs || blogs.length === 0) {
    return <div className="p-8 bg-white border-admin shadow-admin text-center font-bold">No articles found.</div>;
  }

  return (
    <div className="bg-white border-admin shadow-admin overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#BAE6FD] border-b-[3px] border-black">
            <th className="p-4 font-extrabold border-r-[3px] border-black">Title</th>
            <th className="p-4 font-extrabold border-r-[3px] border-black">Category</th>
            <th className="p-4 font-extrabold border-r-[3px] border-black">Status</th>
            <th className="p-4 font-extrabold border-r-[3px] border-black">Views</th>
            <th className="p-4 font-extrabold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id} className="border-b-[3px] border-black last:border-b-0 hover:bg-[#FFFDE6]">
              <td className="p-4 font-bold border-r-[3px] border-black max-w-[200px] truncate">{blog.title}</td>
              <td className="p-4 font-medium border-r-[3px] border-black">{blog.category}</td>
              <td className="p-4 font-medium border-r-[3px] border-black">
                <button 
                  onClick={() => handleTogglePublish(blog)}
                  className={`px-2 py-1 text-xs font-bold border-admin ${blog.published ? 'bg-[#BBF7D0]' : 'bg-gray-200'}`}
                >
                  {blog.published ? 'Published' : 'Draft'}
                </button>
              </td>
              <td className="p-4 font-medium border-r-[3px] border-black">{blog.view_count || 0}</td>
              <td className="p-4 flex gap-2">
                <motion.button
                  onClick={() => onEdit(blog)}
                  className="px-3 py-1 bg-[#BBF7D0] border-admin font-bold text-sm shadow-[2px_2px_0px_0px_#000000]"
                  whileHover={{ y: 1, x: 1, boxShadow: '1px 1px 0px 0px #000000' }}
                >
                  Edit
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(blog.id)}
                  className="px-3 py-1 bg-[#FFEDD5] border-admin font-bold text-sm shadow-[2px_2px_0px_0px_#000000]"
                  whileHover={{ y: 1, x: 1, boxShadow: '1px 1px 0px 0px #000000' }}
                >
                  Delete
                </motion.button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogList;
