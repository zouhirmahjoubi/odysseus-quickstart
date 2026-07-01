import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Mail, Shield, MessageSquare, Info } from 'lucide-react';
import { toast } from 'sonner';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Support ticket created! Our team will get back to you within 24 hours.");
      setIsSubmitting(false);
      e.target.reset();
    }, 1200);
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 font-rounded text-white select-none">
      <Helmet>
        <title>Contact Support | Odysseus AI</title>
        <meta name="description" content="Get support for Odysseus AI setups, Stripe payments, or premium Launch Kit assistance. Connect directly with our developer team." />
      </Helmet>
      
      <div className="max-w-5xl mx-auto pt-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase text-white">
            CONTACT <span className="underline decoration-wavy decoration-[#00F0FF]">SUPPORT</span>
          </h1>
          <p className="text-base text-gray-400 font-semibold max-w-2xl mx-auto">
            Need help with your local LLM setup or your Launch Kit order? Send us a message and our support team will resolve it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <h2 className="text-2xl font-black mb-6 uppercase tracking-tight flex items-center gap-2 text-white">
              <MessageSquare className="w-6 h-6 text-[#00F0FF]" />
              Send a Ticket
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="E.g. PewDiePie Dev"
                    className="neo-input bg-black/20"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="admin@odysseusai.ai"
                    className="neo-input bg-black/20"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                  Subject / Topic
                </label>
                <select
                  id="subject"
                  required
                  className="neo-input bg-black/40 border border-white/10 text-white cursor-pointer rounded-xl"
                >
                  <option value="launch-kit" className="bg-neutral-900 text-white">Launch Kit Setup Support</option>
                  <option value="billing" className="bg-neutral-900 text-white">Checkout & Refunds</option>
                  <option value="docker" className="bg-neutral-900 text-white">Docker & Port Conflicts</option>
                  <option value="general" className="bg-neutral-900 text-white">General Inquiries</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                  Detailed Message
                </label>
                <textarea
                  id="message"
                  required
                  placeholder="Describe your terminal error or transaction ID..."
                  rows={5}
                  className="neo-input bg-black/20 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#00F0FF] text-black hover:bg-[#00F0FF]/85 w-full md:w-auto font-black uppercase text-xs py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
              </button>
            </form>
          </div>

          {/* Quick Info Sidebar */}
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)]">
              <h3 className="text-xl font-black mb-6 uppercase tracking-tight text-[#00F0FF]">
                Support Channels
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#00F0FF] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-sm text-white uppercase">Email Support</h4>
                    <p className="text-xs text-gray-400 font-semibold mt-1">
                      admin@odysseusai.ai
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#00F0FF] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-sm text-white uppercase">Stripe Checkout</h4>
                    <p className="text-xs text-gray-400 font-semibold mt-1 leading-relaxed">
                      Safe checkout processed by Stripe. Refund requests can be processed within 14 days of purchase.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-dashed border-white/20 rounded-3xl p-6 backdrop-blur-md">
              <h3 className="font-black text-sm uppercase text-white mb-2 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#00F0FF]" />
                Before You Open a Ticket
              </h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                If you are running into PowerShell execution errors, port conflicts, or Ollama discovery problems, check our{' '}
                <a href="/fix" className="text-[#00F0FF] font-black underline hover:text-white transition-colors">
                  Error Doctor
                </a>{' '}
                guide first for an instant automated resolution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
