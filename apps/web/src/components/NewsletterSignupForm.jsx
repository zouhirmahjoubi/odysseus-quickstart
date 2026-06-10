
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient.js';

const NewsletterSignupForm = ({ variant = 'default' }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiServerClient.fetch('/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to subscribe');
      
      toast.success('Successfully subscribed to the Odyssey!');
      setEmail('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="neo-card bg-[var(--accent-pale-yellow)] dark:bg-black p-6 w-full">
        <h3 className="text-xl font-black space-grotesk mb-2">Subscribe</h3>
        <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-4">Get the latest updates directly to your inbox.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="Email address" 
            className="neo-input" 
          />
          <button type="submit" disabled={loading} className="neo-button bg-black text-white w-full hover:bg-gray-800">
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="neo-card bg-[var(--accent-mint)] p-8 md:p-12 text-center text-black w-full">
      <h2 className="text-3xl md:text-4xl font-black space-grotesk mb-4">Join the Odyssey</h2>
      <p className="text-lg font-bold mb-8 max-w-2xl mx-auto">
        Subscribe to our newsletter for the latest AI agents, web blueprints, and exclusive developer resources.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
        <input 
          type="email" 
          required 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="operator@example.com" 
          className="neo-input flex-1" 
        />
        <button type="submit" disabled={loading} className="neo-button bg-black text-white px-8 whitespace-nowrap hover:bg-gray-800">
          {loading ? 'Processing...' : <><Send size={18} className="mr-2"/> Subscribe</>}
        </button>
      </form>
    </div>
  );
};

export default NewsletterSignupForm;
