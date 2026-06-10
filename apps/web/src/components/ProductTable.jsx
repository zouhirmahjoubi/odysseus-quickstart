
import React from 'react';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const ProductTable = ({ products, onEdit, onRefresh }) => {
  const handleToggleArchive = async (product) => {
    try {
      const newStatus = product.status === 'active' ? 'archived' : 'active';
      await pb.collection('products').update(product.id, { status: newStatus }, { $autoCancel: false });
      toast.success(`Product ${newStatus}`);
      onRefresh();
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error('Failed to update status');
    }
  };

  if (!products || products.length === 0) {
    return <div className="p-8 bg-white border-admin shadow-admin text-center font-bold">No products found.</div>;
  }

  return (
    <div className="bg-white border-admin shadow-admin overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#BAE6FD] border-b-[3px] border-black">
            <th className="p-4 font-extrabold border-r-[3px] border-black">Product Name</th>
            <th className="p-4 font-extrabold border-r-[3px] border-black">Price</th>
            <th className="p-4 font-extrabold border-r-[3px] border-black">Downloads</th>
            <th className="p-4 font-extrabold border-r-[3px] border-black">Status</th>
            <th className="p-4 font-extrabold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b-[3px] border-black last:border-b-0 hover:bg-[#FFFDE6]">
              <td className="p-4 font-bold border-r-[3px] border-black">{product.name}</td>
              <td className="p-4 font-medium border-r-[3px] border-black">${product.price.toFixed(2)}</td>
              <td className="p-4 font-medium border-r-[3px] border-black">{product.downloads || 0}</td>
              <td className="p-4 font-medium border-r-[3px] border-black">
                <span className={`px-2 py-1 text-xs font-bold border-admin ${product.status === 'active' ? 'bg-[#BBF7D0]' : 'bg-gray-200'}`}>
                  {product.status.toUpperCase()}
                </span>
              </td>
              <td className="p-4 flex gap-2">
                <motion.button
                  onClick={() => onEdit(product)}
                  className="px-3 py-1 bg-[#BBF7D0] border-admin font-bold text-sm shadow-[2px_2px_0px_0px_#000000]"
                  whileHover={{ y: 1, x: 1, boxShadow: '1px 1px 0px 0px #000000' }}
                >
                  Edit
                </motion.button>
                <motion.button
                  onClick={() => handleToggleArchive(product)}
                  className="px-3 py-1 bg-[#FFEDD5] border-admin font-bold text-sm shadow-[2px_2px_0px_0px_#000000]"
                  whileHover={{ y: 1, x: 1, boxShadow: '1px 1px 0px 0px #000000' }}
                >
                  {product.status === 'active' ? 'Archive' : 'Unarchive'}
                </motion.button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
