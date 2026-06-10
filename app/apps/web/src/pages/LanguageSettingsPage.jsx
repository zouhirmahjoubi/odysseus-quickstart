
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Globe, Save } from 'lucide-react';
import { toast } from 'sonner';

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 
  'Chinese Simplified', 'Chinese Traditional', 'Japanese', 'Korean', 'Arabic', 
  'Hindi', 'Dutch', 'Polish', 'Turkish', 'Vietnamese', 'Thai', 'Indonesian', 'Filipino'
];

const LanguageSettingsPage = () => {
  const [lang, setLang] = useState('English');
  const [autoDetect, setAutoDetect] = useState(true);

  const handleSave = () => {
    toast.success('Language preferences saved');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet><title>Language Settings - OdysseusAI</title></Helmet>
      <div className="mb-10 border-b-[3px] border-black pb-6">
        <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
          <Globe size={36} /> Language Settings
        </h1>
      </div>
      
      <div className="neo-card bg-white space-y-8">
        <div>
          <label className="block font-black mb-3">Display Language</label>
          <select value={lang} onChange={e => setLang(e.target.value)} className="neo-input text-lg font-bold">
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        
        <label className="flex items-center gap-3 font-bold cursor-pointer">
          <input type="checkbox" checked={autoDetect} onChange={e => setAutoDetect(e.target.checked)} className="w-6 h-6 border-neo accent-black" />
          Auto-detect language based on browser settings
        </label>
        
        <button onClick={handleSave} className="neo-button bg-[hsl(var(--primary))] text-black w-full text-lg">
          <Save size={20} className="mr-2"/> Save Preferences
        </button>
      </div>
    </div>
  );
};

export default LanguageSettingsPage;
