
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    siteName: 'OdysseusAI',
    siteUrl: 'https://odysseusai.ai',
    contactEmail: 'support@odysseusai.ai',
    stripeKey: 'sk_live_**********************xyz',
    metaDesc: 'Premium digital assets and AI tools'
  });

  const handleChange = (e) => setSettings({ ...settings, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Helmet><title>Settings | Admin</title></Helmet>

      <div className="flex justify-between items-center bg-card neo-border p-6 shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
        <h1 className="text-3xl font-black uppercase">Platform Settings</h1>
        <button onClick={handleSave} className="neo-button bg-primary text-primary-foreground py-2">
          <Save size={20} className="mr-2" /> Save Changes
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="neo-card p-8">
          <h2 className="text-xl font-black uppercase mb-6 border-b-4 border-border pb-4">General Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-black uppercase mb-2">Site Name</label>
              <input name="siteName" value={settings.siteName} onChange={handleChange} className="neo-input py-3" />
            </div>
            <div>
              <label className="block font-black uppercase mb-2">Site URL</label>
              <input name="siteUrl" value={settings.siteUrl} onChange={handleChange} className="neo-input py-3" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-black uppercase mb-2">Contact Email</label>
              <input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} className="neo-input py-3" />
            </div>
          </div>
        </div>

        <div className="neo-card p-8">
          <h2 className="text-xl font-black uppercase mb-6 border-b-4 border-border pb-4">Integrations</h2>
          <div>
            <label className="block font-black uppercase mb-2">Stripe Secret Key</label>
            <input type="password" name="stripeKey" value={settings.stripeKey} onChange={handleChange} className="neo-input py-3 font-mono" />
            <p className="mt-2 text-sm font-bold text-muted-foreground">Used for marketplace transactions. Keep this secure.</p>
          </div>
        </div>

        <div className="neo-card p-8">
          <h2 className="text-xl font-black uppercase mb-6 border-b-4 border-border pb-4">SEO Defaults</h2>
          <div>
            <label className="block font-black uppercase mb-2">Global Meta Description</label>
            <textarea name="metaDesc" value={settings.metaDesc} onChange={handleChange} className="neo-input py-3 min-h-[100px]" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
