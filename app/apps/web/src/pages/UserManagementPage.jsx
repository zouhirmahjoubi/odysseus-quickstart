
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Eye, Search, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import AdminLayout from '@/components/AdminLayout.jsx';
import UserDetailModal from '@/components/UserDetailModal.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      const records = await pb.collection('users').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setUsers(records);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await pb.collection('users').delete(id, { $autoCancel: false });
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleUpdate = (updatedUser) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-[4px] border-[hsl(var(--border))] border-t-[hsl(var(--accent))]"></div>
            <p className="mt-4 font-bold text-[hsl(var(--muted-foreground))]">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>User Management - Admin - Odysseusai.ai</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-black text-[hsl(var(--foreground))]">User Management</h1>
          <p className="text-[hsl(var(--muted-foreground))] font-bold mt-1">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={18} />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neo-input pl-10"
          />
        </div>

        {/* Table */}
        <div className="border-[3px] border-[hsl(var(--border))] rounded-[var(--radius)] overflow-hidden bg-[hsl(var(--card))]">
          <Table>
            <TableHeader>
              <TableRow className="bg-[hsl(var(--muted))] border-b-[3px] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]">
                <TableHead className="font-black text-[hsl(var(--foreground))]">User</TableHead>
                <TableHead className="font-black text-[hsl(var(--foreground))]">Email</TableHead>
                <TableHead className="font-black text-[hsl(var(--foreground))]">Joined</TableHead>
                <TableHead className="font-black text-[hsl(var(--foreground))]">Status</TableHead>
                <TableHead className="font-black text-[hsl(var(--foreground))] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <TableRow key={user.id} className="border-b-[2px] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img 
                            src={pb.files.getUrl(user, user.avatar)} 
                            alt={user.name || user.email}
                            className="w-10 h-10 border-[2px] border-[hsl(var(--border))] rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 border-[2px] border-[hsl(var(--border))] rounded-full bg-[hsl(var(--muted))] flex items-center justify-center text-[hsl(var(--muted-foreground))]">
                            <User size={20} />
                          </div>
                        )}
                        <span className="font-bold text-[hsl(var(--foreground))]">{user.name || 'No name'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[hsl(var(--foreground))]">{user.email}</TableCell>
                    <TableCell className="text-[hsl(var(--muted-foreground))]">{new Date(user.created).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 border-[2px] border-[hsl(var(--border))] rounded-[var(--radius)] font-bold text-sm ${
                        user.verified ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
                      }`}>
                        {user.verified ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => setSelectedUser(user)}
                          className="neo-button p-2 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] rounded-[var(--radius)]"
                          size="sm"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(user.id)}
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
                  <TableCell colSpan={5} className="text-center py-12 text-[hsl(var(--muted-foreground))]">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={handleUpdate}
        />
      )}
    </AdminLayout>
  );
};

export default UserManagementPage;
