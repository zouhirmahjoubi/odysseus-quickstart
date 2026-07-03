
import React, { useState } from 'react';
import { Save } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const AgentForm = ({ agent, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState(agent || {
    name: '', type: 'CrewAI', category: '', description: '', long_description: '',
    price: 0, billing_type: 'one-time', documentation_url: '', support_email: '', status: 'active'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = agent ? `/odysseus-agents/${agent.id}` : '/odysseus-agents';
      const method = agent ? 'PUT' : 'POST';
      
      const res = await apiServerClient.fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save agent');
      
      toast.success('Agent saved successfully');
      onSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="neo-card bg-white space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-black space-grotesk border-b-[3px] border-black pb-4">
        {agent ? 'Edit Agent' : 'Create New Agent'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className="block font-bold mb-2">Name *</label><input type="text" name="name" required value={formData.name} onChange={handleChange} className="neo-input" /></div>
        <div>
          <label className="block font-bold mb-2">Type *</label>
          <select name="type" required value={formData.type} onChange={handleChange} className="neo-input">
            <option value="CrewAI">CrewAI</option>
            <option value="AutoGen">AutoGen</option>
            <option value="OpenHands">OpenHands</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
        <div><label className="block font-bold mb-2">Category *</label><input type="text" name="category" required value={formData.category} onChange={handleChange} className="neo-input" /></div>
        <div><label className="block font-bold mb-2">Price ($) *</label><input type="number" name="price" min="0" step="0.01" required value={formData.price} onChange={handleChange} className="neo-input" /></div>
      </div>

      <div><label className="block font-bold mb-2">Short Description *</label><textarea name="description" required rows="2" value={formData.description} onChange={handleChange} className="neo-input resize-none"></textarea></div>
      <div><label className="block font-bold mb-2">Long Description</label><textarea name="long_description" rows="5" value={formData.long_description} onChange={handleChange} className="neo-input resize-none"></textarea></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className="block font-bold mb-2">Documentation URL</label><input type="url" name="documentation_url" value={formData.documentation_url} onChange={handleChange} className="neo-input" /></div>
        <div><label className="block font-bold mb-2">Support Email</label><input type="email" name="support_email" value={formData.support_email} onChange={handleChange} className="neo-input" /></div>
        <div>
          <label className="block font-bold mb-2">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="neo-input">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t-[3px] border-black">
        <button type="button" onClick={onCancel} className="neo-button bg-gray-200 text-black flex-1">Cancel</button>
        <button type="submit" disabled={loading} className="neo-button bg-[var(--primary-accent)] text-black flex-1">
          <Save size={20} className="mr-2" /> Save Agent
        </button>
      </div>
    </form>
  );
};

export default AgentForm;
