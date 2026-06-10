
import React, { useState } from 'react';
import { X, User, Mail, Calendar, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button.jsx';
import { Switch } from '@/components/ui/switch.jsx';

const UserDetailModal = ({ user, onClose, onUpdate }) => {
  const [isActive, setIsActive] = useState(user?.verified || false);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleStatusToggle = async () => {
    setLoading(true);
    try {
      const updated = await pb.collection('users').update(user.id, {
        verified: !isActive
      }, { $autoCancel: false });
      setIsActive(updated.verified);
      toast.success(`User ${updated.verified ? 'activated' : 'deactivated'} successfully`);
      onUpdate(updated);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[hsl(var(--card))] border-[3px] border-[hsl(var(--border-color))] shadow-[8px_8px_0px_0px_hsl(var(--border-color))] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[hsl(var(--card))] border-b-[3px] border-[hsl(var(--border-color))] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black">User Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-[hsl(var(--muted))] transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Avatar & Name */}
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img 
                src={pb.files.getUrl(user, user.avatar)} 
                alt={user.name || user.email}
                className="w-20 h-20 border-[3px] border-[hsl(var(--border-color))] object-cover"
              />
            ) : (
              <div className="w-20 h-20 border-[3px] border-[hsl(var(--border-color))] bg-[hsl(var(--muted))] flex items-center justify-center">
                <User size={32} />
              </div>
            )}
            <div>
              <h3 className="text-xl font-black">{user.name || 'No name set'}</h3>
              <p className="text-[hsl(var(--muted-foreground))]">{user.email}</p>
            </div>
          </div>

          {/* User Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-[3px] border-[hsl(var(--border-color))] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={18} />
                <p className="text-sm text-[hsl(var(--muted-foreground))] font-bold">Email</p>
              </div>
              <p className="font-bold break-all">{user.email}</p>
            </div>

            <div className="border-[3px] border-[hsl(var(--border-color))] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} />
                <p className="text-sm text-[hsl(var(--muted-foreground))] font-bold">Joined</p>
              </div>
              <p className="font-bold">{new Date(user.created).toLocaleDateString()}</p>
            </div>

            <div className="border-[3px] border-[hsl(var(--border-color))] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} />
                <p className="text-sm text-[hsl(var(--muted-foreground))] font-bold">Last Updated</p>
              </div>
              <p className="font-bold">{new Date(user.updated).toLocaleDateString()}</p>
            </div>

            <div className="border-[3px] border-[hsl(var(--border-color))] p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag size={18} />
                <p className="text-sm text-[hsl(var(--muted-foreground))] font-bold">Email Verified</p>
              </div>
              <p className="font-bold">{user.verified ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {/* Account Status Toggle */}
          <div className="border-[3px] border-[hsl(var(--border-color))] p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg">Account Status</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {isActive ? 'Account is active' : 'Account is inactive'}
                </p>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={handleStatusToggle}
                disabled={loading}
              />
            </div>
          </div>

          <Button onClick={onClose} className="neo-button w-full bg-[hsl(var(--muted))]">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
