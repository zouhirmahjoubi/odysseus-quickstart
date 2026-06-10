
import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await pb.collection('newsletter_subscribers').create({ email }, { $autoCancel: false });
      toast.success('✓ Subscribed! Check your email.');
      setEmail('');
    } catch (error) {
      console.error('Newsletter error:', error);
      if (error.response?.data?.email?.code === 'validation_not_unique') {
        toast.error('This email is already subscribed.');
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="neo-card max-w-2xl mx-auto my-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-none neo-border bg-[hsl(var(--highlight))] mb-6">
        <Mail size={32} className="text-[hsl(var(--text-primary))]" />
      </div>
      <h2 className="text-3xl font-black mb-2">📧 Telemetry-Free Release Updates</h2>
      <p className="text-lg font-medium opacity-80 mb-8">
        Plain-text changelogs. Security warnings. Zero tracking.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="neo-input flex-1"
          required
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="neo-button bg-[hsl(var(--highlight))] text-[hsl(var(--border-color))] flex items-center justify-center gap-2 whitespace-nowrap"
          disabled={isLoading}
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'} <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
