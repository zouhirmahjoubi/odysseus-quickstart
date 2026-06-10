
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await pb.collection('contacts').create(formData, { $autoCancel: false });
      toast.success('Message sent! We will get back to you shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-admin shadow-admin p-6 md:p-8 space-y-6">
      <h3 className="text-2xl font-extrabold mb-6">Secure Comm Link</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-bold text-black block">Operator Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border-admin shadow-admin focus:outline-none focus:shadow-admin-hover transition-shadow bg-white text-black"
            placeholder="Jane Doe"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-black block">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border-admin shadow-admin focus:outline-none focus:shadow-admin-hover transition-shadow bg-white text-black"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-bold text-black block">Subject *</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full p-3 border-admin shadow-admin focus:outline-none focus:shadow-admin-hover transition-shadow bg-white text-black"
          placeholder="System integration inquiry..."
        />
      </div>

      <div className="space-y-2">
        <label className="font-bold text-black block">Message *</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full p-3 border-admin shadow-admin focus:outline-none focus:shadow-admin-hover transition-shadow bg-white text-black resize-y"
          placeholder="Enter encrypted message here..."
        />
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 font-bold text-lg border-admin shadow-admin text-white gradient-primary animated-gradient disabled:opacity-50"
        whileHover={{ y: 2, x: 2, boxShadow: '2px 2px 0px 0px #000000' }}
        whileTap={{ y: 4, x: 4, boxShadow: '0px 0px 0px 0px #000000' }}
      >
        {isSubmitting ? 'Transmitting...' : 'Transmit Message'}
      </motion.button>
    </form>
  );
};

export default ContactForm;
