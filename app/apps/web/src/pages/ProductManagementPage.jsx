
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import AdminLayout from '@/components/AdminLayout.jsx';
import ProductEditorForm from '@/components/ProductEditorForm.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        pb.collection('products').getFullList({
          sort: '-created',
          expand: 'category',
          $autoCancel: false
        }),
        pb.collection('categories').getFullList({ $autoCancel: false })
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await pb.collection('products').delete(id, { $autoCancel: false });
      toast.success('Product deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      await pb.collection('products').update(product.id, { status: newStatus }, { $autoCancel: false });
      toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      fetchData();
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Failed to update product status');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowEditor(true);
  };

  const handleSave = () => {
    fetchData();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-[4px] border-[hsl(var(--border))] border-t-[hsl(var(--accent))]"></div>
            <p className="mt-4 font-bold text-[hsl(var(--muted-foreground))]">Loading products...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Product Management - Admin - Odysseusai.ai</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-[hsl(var(--foreground))]">Product Management</h1>
            <p className="text-[hsl(var(--muted-foreground))] font-bold mt-1">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={handleCreate} className="neo-button bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-[var(--radius)]">
            <Plus size={18} className="mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={18} />
            <Input
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neo-input pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="neo-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border-[3px] border-[hsl(var(--border))] rounded-[var(--radius)] overflow-hidden bg-[hsl(var(--card))]">
          <Table>
            <TableHeader>
              <TableRow className="bg-[hsl(var(--muted))] border-b-[3px] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]">
                <TableHead className="font-black text-[hsl(var(--foreground))]">Name</TableHead>
                <TableHead className="font-black text-[hsl(var(--foreground))]">Price</TableHead>
                <TableHead className="font-black text-[hsl(var(--foreground))]">Stock</TableHead>
                <TableHead className="font-black text-[hsl(var(--foreground))]">Category</TableHead>
                <TableHead className="font-black text-[hsl(var(--foreground))]">Status</TableHead>
                <TableHead className="font-black text-[hsl(var(--foreground))] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <TableRow key={product.id} className="border-b-[2px] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/50 transition-colors">
                    <TableCell className="font-bold text-[hsl(var(--foreground))]">{product.name}</TableCell>
                    <TableCell>
                      {product.discount_price ? (
                        <div>
                          <span className="line-through text-[hsl(var(--muted-foreground))]">${product.price}</span>
                          <span className="ml-2 text-[hsl(var(--accent))] font-bold">${product.discount_price}</span>
                        </div>
                      ) : (
                        <span className="text-[hsl(var(--foreground))]">${product.price}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-[hsl(var(--foreground))]">{product.stock}</TableCell>
                    <TableCell className="text-[hsl(var(--muted-foreground))]">{product.expand?.category?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={`px-3 py-1 border-[2px] border-[hsl(var(--border))] rounded-[var(--radius)] font-bold text-sm transition-colors ${
                          product.status === 'active'
                            ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]'
                            : 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
                        }`}
                      >
                        {product.status}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleEdit(product)}
                          className="neo-button p-2 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] rounded-[var(--radius)]"
                          size="sm"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(product.id)}
                          className="neo-button p-2 bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] rounded-[var(--radius)]"
                          size="sm"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-[hsl(var(--muted-foreground))]">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {showEditor && (
        <ProductEditorForm
          product={editingProduct}
          onClose={() => setShowEditor(false)}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  );
};

export default ProductManagementPage;
