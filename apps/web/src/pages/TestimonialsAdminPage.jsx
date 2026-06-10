
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, Search, Star } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const TestimonialsAdminPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('testimonials').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setTestimonials(records);
    } catch (err) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await pb.collection('testimonials').delete(id, { $autoCancel: false });
      toast.success('Deleted');
      fetchTestimonials();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const filtered = testimonials.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  const TestimonialForm = () => {
    const [formData, setFormData] = useState(currentTestimonial || {
      name: '', title: '', email: '', text: '', rating: 5, status: 'approved', featured: false
    });
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (file) data.append('avatar', file);

        if (currentTestimonial) {
          await pb.collection('testimonials').update(currentTestimonial.id, data, { $autoCancel: false });
          toast.success('Updated successfully');
        } else {
          await pb.collection('testimonials').create(data, { $autoCancel: false });
          toast.success('Created successfully');
        }
        setIsEditing(false);
        fetchTestimonials();
      } catch (err) {
        toast.error('Failed to save');
      } finally {
        setSaving(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="neo-card bg-white space-y-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-black space-grotesk border-b-[3px] border-black pb-4">
          {currentTestimonial ? 'Edit Testimonial' : 'New Testimonial'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block font-bold mb-2">Name *</label><input type="text" required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="neo-input" /></div>
          <div><label className="block font-bold mb-2">Title/Company</label><input type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="neo-input" /></div>
          <div><label className="block font-bold mb-2">Email *</label><input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="neo-input" /></div>
          <div><label className="block font-bold mb-2">Rating (1-5) *</label><input type="number" min="1" max="5" required value={formData.rating} onChange={e=>setFormData({...formData, rating: e.target.value})} className="neo-input" /></div>
        </div>
        <div><label className="block font-bold mb-2">Testimonial Text *</label><textarea required rows="4" value={formData.text} onChange={e=>setFormData({...formData, text: e.target.value})} className="neo-input resize-none"></textarea></div>
        <div><label className="block font-bold mb-2">Avatar Image</label><input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} className="neo-input" /></div>
        <div className="flex gap-6">
          <div>
            <label className="block font-bold mb-2">Status</label>
            <select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="neo-input">
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center mt-8">
            <input type="checkbox" id="featured" checked={formData.featured} onChange={e=>setFormData({...formData, featured: e.target.checked})} className="w-6 h-6 neo-border accent-black" />
            <label htmlFor="featured" className="ml-2 font-bold">Featured on Homepage</label>
          </div>
        </div>
        <div className="flex gap-4 pt-6 border-t-[3px] border-black">
          <button type="button" onClick={() => setIsEditing(false)} className="neo-button bg-gray-200 text-black flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="neo-button bg-[var(--accent-mint)] text-black flex-1">Save Testimonial</button>
        </div>
      </form>
    );
  };

  if (isEditing) {
    return <div className="px-4 py-8"><TestimonialForm /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet><title>Testimonials Admin - OdysseusAI</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-[3px] border-black pb-4 gap-4">
        <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
          <Star size={36} /> Testimonials
        </h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input type="text" placeholder="Search names..." value={search} onChange={(e) => setSearch(e.target.value)} className="neo-input pl-10 py-2" />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
          </div>
          <button onClick={() => { setCurrentTestimonial(null); setIsEditing(true); }} className="neo-button bg-[var(--accent-mint)] text-black whitespace-nowrap">
            <Plus size={20} className="mr-2" /> Add New
          </button>
        </div>
      </div>

      <div className="neo-card p-0 overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[hsl(var(--background))] border-b-[3px] border-black text-sm uppercase tracking-wide">
              <th className="p-4 font-black">Name</th>
              <th className="p-4 font-black">Rating</th>
              <th className="p-4 font-black">Status</th>
              <th className="p-4 font-black">Featured</th>
              <th className="p-4 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center font-bold">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center font-bold text-gray-500">No testimonials found.</td></tr>
            ) : (
              filtered.map(t => (
                <tr key={t.id} className="border-b border-dashed border-gray-300 hover:bg-gray-50">
                  <td className="p-4 font-bold">{t.name} <br/><span className="text-xs text-gray-500 font-medium">{t.title}</span></td>
                  <td className="p-4 font-bold flex items-center text-yellow-500"><Star size={16} className="fill-current mr-1"/> {t.rating}</td>
                  <td className="p-4">
                    <span className={`neo-badge ${t.status === 'approved' ? 'bg-[var(--accent-mint)]' : t.status === 'rejected' ? 'bg-red-200' : 'bg-yellow-200'}`}>
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 font-bold">{t.featured ? 'Yes' : 'No'}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setCurrentTestimonial(t); setIsEditing(true); }} className="p-2 neo-border bg-white hover:bg-[var(--accent-sky)]"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-2 neo-border bg-white hover:bg-red-500 hover:text-white"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestimonialsAdminPage;
