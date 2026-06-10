
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Eye, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import AdminLayout from '@/components/AdminLayout.jsx';
import OrderDetailModal from '@/components/OrderDetailModal.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const records = await pb.collection('orders').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setOrders(records);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await pb.collection('orders').delete(id, { $autoCancel: false });
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await pb.collection('orders').update(orderId, { status: newStatus }, { $autoCancel: false });
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-[4px] border-[hsl(var(--border))] border-t-[hsl(var(--accent))]"></div>
            <p className="mt-4 font-bold text-[hsl(var(--muted-foreground))]">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Order Management - Admin - Odysseusai.ai</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-black text-[hsl(var(--foreground))]">Order Management</h1>
          <p className="text-[hsl(var(--muted-foreground))] font-bold mt-1">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={18} />
            <Input
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neo-input pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="neo-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border-[3px] border-[hsl(var(--border))] rounded-[var(--radius)] overflow-hidden bg-[hsl(var(--card))]">
          <Table>
            <TableHeader>
              <TableRow className="bg-[hsl(var(--muted))] border-b-[3px] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]">
                <TableHead className="font-black text-[hsl(var(--foreground))]">Order ID</TableHead>
                <TableHead className="font-black text-[hsl(var(--foreground))]">Customer</TableHead>
                <TableHead className="font-black text-[hsl(var(--foreground))]">Total</TableHead>
                <TableHead className="font-black text-[hsl(var(--foreground))]">Status</TableHead>
                <TableHead className="font-black text-[hsl(var(--foreground))]">Date</TableHead>
                <TableHead className="font-black text-[hsl(var(--foreground))] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <TableRow key={order.id} className="border-b-[2px] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/50 transition-colors">
                    <TableCell className="font-bold text-[hsl(var(--foreground))]">{order.orderId}</TableCell>
                    <TableCell className="text-[hsl(var(--foreground))]">{order.customerId || 'Guest'}</TableCell>
                    <TableCell className="font-bold text-[hsl(var(--foreground))]">${order.total?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-32 border-[2px] border-[hsl(var(--border))] rounded-[var(--radius)] font-bold text-sm bg-[hsl(var(--card))] text-[hsl(var(--foreground))]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-[hsl(var(--muted-foreground))]">{new Date(order.created).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => setSelectedOrder(order)}
                          className="neo-button p-2 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] rounded-[var(--radius)]"
                          size="sm"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(order.id)}
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
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </AdminLayout>
  );
};

export default OrderManagementPage;
