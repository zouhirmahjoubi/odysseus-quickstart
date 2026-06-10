
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const ContactFormPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: 'General Inquiry', message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await apiServerClient.fetch('/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit form');
      
      setStatus('success');
      toast.success('Message sent successfully!');
    } catch (error) {
      setStatus('idle');
      toast.error(error.message);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="neo-card bg-[var(--accent-mint)] text-black max-w-lg w-full text-center py-16">
          <CheckCircle size={64} className="mx-auto mb-6" />
          <h1 className="text-4xl font-black space-grotesk mb-4">Message Received!</h1>
          <p className="text-lg font-bold mb-8">
            Thank you for reaching out. Our team will get back to you within 24-48 hours.
          </p>
          <button onClick={() => { setStatus('idle'); setFormData({name:'', email:'', phone:'', subject:'General Inquiry', message:''}); }} className="neo-button bg-white text-black">
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <Helmet><title>Contact Us - OdysseusAI</title></Helmet>
      
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black space-grotesk mb-6">Get in <span className="text-[hsl(var(--primary))]">Touch</span></h1>
        <p className="text-xl font-bold text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Have a question about our blueprints, need technical support, or want to discuss a partnership? We're here to help.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Contact Info */}
        <div className="w-full lg:w-1/3 space-y-8">
          <div className="neo-card bg-[var(--accent-sky)] text-black">
            <div className="w-12 h-12 bg-white neo-border flex items-center justify-center mb-6">
              <Mail size={24} />
            </div>
            <h3 className="text-2xl font-black space-grotesk mb-2">Email Us</h3>
            <p className="font-bold mb-1">Support: support@odysseusai.com</p>
            <p className="font-bold">Sales: sales@odysseusai.com</p>
          </div>
          
          <div className="neo-card bg-[var(--accent-pale-yellow)] text-black dark:bg-black dark:text-white">
            <div className="w-12 h-12 bg-white neo-border flex items-center justify-center mb-6 text-black">
              <MapPin size={24} />
            </div>
            <h3 className="text-2xl font-black space-grotesk mb-2">Headquarters</h3>
            <p className="font-bold">123 Innovation Drive<br/>Tech District, CA 94105<br/>United States</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full lg:w-2/3">
          <form onSubmit={handleSubmit} className="neo-card bg-white dark:bg-black p-8 md:p-12">
            <h2 className="text-3xl font-black space-grotesk mb-8 border-b-[3px] border-black pb-4">Send a Message</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-bold mb-2">Full Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="neo-input" placeholder="John Doe" />
              </div>
              <div>
                <label className="block font-bold mb-2">Email Address *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="neo-input" placeholder="john@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-bold mb-2">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="neo-input" placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className="block font-bold mb-2">Subject *</label>
                <select name="subject" required value={formData.subject} onChange={handleChange} className="neo-input cursor-pointer">
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Support">Technical Support</option>
                  <option value="Sales">Sales & Pricing</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="block font-bold mb-2">Message *</label>
              <textarea 
                name="message" 
                required 
                minLength={10}
                rows={6} 
                value={formData.message} 
                onChange={handleChange} 
                className="neo-input resize-none" 
                placeholder="How can we help you today?"
              ></textarea>
            </div>

            <button type="submit" disabled={status === 'loading'} className="neo-button bg-black text-white w-full text-lg py-4 hover:bg-[var(--accent-mint)] hover:text-black">
              {status === 'loading' ? 'Sending...' : <><Send size={20} className="mr-2" /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactFormPage;
