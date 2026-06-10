
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trash2, Save, X } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const ComparisonMode = ({ models, onClear, onRemove }) => {
  const { user } = useAuth();

  if (!models || models.length === 0) return null;

  const chartData = models.map(m => ({
    name: m.name,
    vramInt4: m.vramReq.int4,
    speed: m.speed,
    mmlu: m.mmlu
  }));

  const handleSave = async () => {
    if (!user) {
      toast.error('Please log in to save comparisons');
      return;
    }
    try {
      await pb.collection('saved_comparisons').create({
        userId: user.id,
        comparisonName: `${models[0].name} vs ...`,
        models: JSON.stringify(models.map(m => m.id))
      }, { $autoCancel: false });
      toast.success('Comparison saved successfully!');
    } catch (error) {
      toast.error('Failed to save comparison');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="neo-card bg-[hsl(var(--bg-sidebar))] mt-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black">Model Comparison</h2>
        <div className="flex gap-2">
          <button onClick={handleSave} className="neo-button bg-[hsl(var(--secondary))] py-2 px-4 text-sm flex items-center gap-2">
            <Save size={16} /> Save
          </button>
          <button onClick={onClear} className="neo-button bg-red-500 text-white py-2 px-4 text-sm flex items-center gap-2">
            <Trash2 size={16} /> Clear
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left border-collapse neo-border bg-[hsl(var(--card-bg))]">
          <thead>
            <tr className="border-b-[3px] border-[hsl(var(--border-color))] bg-[hsl(var(--primary))] text-black">
              <th className="p-3 font-bold">Feature</th>
              {models.map(m => (
                <th key={m.id} className="p-3 font-bold border-l-[3px] border-[hsl(var(--border-color))]">
                  <div className="flex justify-between items-center">
                    {m.name}
                    <button onClick={() => onRemove(m.id)} className="hover:text-red-700 transition-colors p-1">
                      <X size={16} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b-[3px] border-[hsl(var(--border-color))]">
              <td className="p-3 font-bold">Parameters</td>
              {models.map(m => <td key={m.id} className="p-3 border-l-[3px] border-[hsl(var(--border-color))]">{m.params}</td>)}
            </tr>
            <tr className="border-b-[3px] border-[hsl(var(--border-color))]">
              <td className="p-3 font-bold">VRAM (INT4)</td>
              {models.map(m => <td key={m.id} className="p-3 border-l-[3px] border-[hsl(var(--border-color))]">{m.vramReq.int4} GB</td>)}
            </tr>
            <tr className="border-b-[3px] border-[hsl(var(--border-color))]">
              <td className="p-3 font-bold">Speed (tok/s)</td>
              {models.map(m => <td key={m.id} className="p-3 border-l-[3px] border-[hsl(var(--border-color))]">{m.speed}</td>)}
            </tr>
            <tr>
              <td className="p-3 font-bold">MMLU Score</td>
              {models.map(m => <td key={m.id} className="p-3 border-l-[3px] border-[hsl(var(--border-color))]">{m.mmlu}</td>)}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="neo-border bg-[hsl(var(--card-bg))] p-4 h-64">
          <h3 className="font-bold mb-2 text-center">VRAM Requirement (INT4) - Lower is better</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-color))" opacity={0.2} />
              <XAxis dataKey="name" stroke="hsl(var(--text-primary))" />
              <YAxis stroke="hsl(var(--text-primary))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card-bg))', border: '3px solid hsl(var(--border-color))', borderRadius: 0 }} />
              <Bar dataKey="vramInt4" fill="hsl(var(--primary))" stroke="hsl(var(--border-color))" strokeWidth={3} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="neo-border bg-[hsl(var(--card-bg))] p-4 h-64">
          <h3 className="font-bold mb-2 text-center">MMLU Score - Higher is better</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-color))" opacity={0.2} />
              <XAxis dataKey="name" stroke="hsl(var(--text-primary))" />
              <YAxis stroke="hsl(var(--text-primary))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card-bg))', border: '3px solid hsl(var(--border-color))', borderRadius: 0 }} />
              <Bar dataKey="mmlu" fill="hsl(var(--secondary))" stroke="hsl(var(--border-color))" strokeWidth={3} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default ComparisonMode;
