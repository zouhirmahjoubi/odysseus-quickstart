
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Search } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  
  const fetchUsers = async () => {
    try {
      const records = await pb.collection('users').getFullList({ sort: '-created', $autoCancel: false });
      setUsers(records);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await pb.collection('users').delete(id, { $autoCancel: false });
        toast.success('User deleted');
        fetchUsers();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  const filtered = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()) || (u.name && u.name.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="space-y-8">
      <Helmet><title>Users | Admin</title></Helmet>
      
      <div className="flex justify-between items-center bg-card neo-border p-6 shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
        <h1 className="text-3xl font-black uppercase">User Management</h1>
      </div>

      <div className="neo-card p-6">
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search users by email or name..." 
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
                <th className="p-4 font-black uppercase">Email</th>
                <th className="p-4 font-black uppercase">Joined</th>
                <th className="p-4 font-black uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-b-4 border-border hover:bg-muted transition-colors">
                  <td className="p-4 font-bold">{user.name || 'N/A'}</td>
                  <td className="p-4 font-bold">{user.email}</td>
                  <td className="p-4 font-medium text-muted-foreground">{new Date(user.created).toLocaleDateString()}</td>
                  <td className="p-4 flex justify-end gap-3">
                    <Link to={`/zouhirmahjoubi/users/edit/${user.id}`} className="p-2 bg-card border-4 border-border rounded hover:bg-primary transition-colors shadow-sm">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(user.id)} className="p-2 bg-card border-4 border-border rounded hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center font-bold text-muted-foreground">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserListPage;
