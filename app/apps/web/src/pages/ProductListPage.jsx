
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  
  const fetchProducts = async () => {
    try {
      const records = await pb.collection('products').getFullList({ sort: '-created', $autoCancel: false });
      setProducts(records);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await pb.collection('products').delete(id, { $autoCancel: false });
        toast.success('Product deleted');
        fetchProducts();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <Helmet><title>Products | Admin</title></Helmet>
      
      <div className="flex justify-between items-center bg-card neo-border p-6 shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
        <h1 className="text-3xl font-black uppercase">Products</h1>
        <Link to="/zouhirmahjoubi/products/edit/new" className="neo-button bg-accent text-accent-foreground py-2">
          <Plus size={20} className="mr-2" /> New Product
        </Link>
      </div>

      <div className="neo-card p-6">
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="neo-input pl-12 py-3"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-primary text-primary-foreground border-b-4 border-border">
                <th className="p-4 font-black uppercase">Name</th>
                <th className="p-4 font-black uppercase">Price</th>
                <th className="p-4 font-black uppercase">Status</th>
                <th className="p-4 font-black uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b-4 border-border hover:bg-muted transition-colors">
                  <td className="p-4 font-bold">{item.name}</td>
                  <td className="p-4 font-bold">${item.price}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 font-bold text-sm uppercase rounded-full border-2 border-border shadow-sm ${item.status === 'active' ? 'bg-secondary' : 'bg-muted'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-3">
                    <Link to={`/zouhirmahjoubi/products/edit/${item.id}`} className="p-2 bg-card border-4 border-border rounded hover:bg-primary transition-colors shadow-sm">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-card border-4 border-border rounded hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center font-bold text-muted-foreground">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
