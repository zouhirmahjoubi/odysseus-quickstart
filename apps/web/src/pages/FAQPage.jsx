import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion.jsx';
import PageTransition from '@/components/PageTransition.jsx';

const FAQPage = () => {
  const faqCategories = [
    {
      title: "Odysseus AI Setup & Install FAQs",
      faqs: [
        {
          question: "Is this the official Odysseus AI website?",
          answer: "No. OdysseusAI.ai is an independent, unofficial install and troubleshooting guide resource. We are not affiliated with the official pewdiepie-archdaemon/odysseus GitHub repository structures."
        },
        {
          question: "Are you selling raw Odysseus bin weights?",
          answer: "No. Odysseus AI is completely free and open-source. We do not sell or distribute Odysseus AI itself or any pre-compiled model weights. You should clone and verify the official repository directly from GitHub."
        },
        {
          question: "Is the Launch Kit an automated one-click installer app?",
          answer: "No. The Launch Kit is a custom workbook of environment configurations, Docker Compose templates, PowerShell execution scripts, and diagnostic guides. It helps you avoid hours of troubleshooting local node packages, databases, and network adapters, but it is not a standalone executable file."
        },
        {
          question: "What is the absolute best install route to pick?",
          answer: "There is no single 'best' route; it depends on your machine and preferences. We recommend Docker Compose for most Windows and Linux users because it isolates dependencies and manages PocketBase SQLite databases out-of-the-box. If you want maximum local GPU performance on Apple Silicon, native macOS execution is preferred."
        },
        {
          question: "Do I need Docker installed on my computer?",
          answer: "Only if you choose the Docker Compose installation route. If you choose to run natively via our PowerShell or macOS launcher scripts, you do not need Docker; you will only need Git and Python 3.10+ installed on your host system."
        },
        {
          question: "Do I absolutely need Ollama operational?",
          answer: "Not necessarily, but it is highly recommended if you want a 100% private and offline workspace. Odysseus acts as the frontend interface; it does not contain a built-in LLM. You can either connect to local models using Ollama, or enter API credentials for cloud models like OpenRouter, OpenAI, or Anthropic."
        }
      ]
    }
  ];

  return (
    <PageTransition>
      <Helmet>
        <title>Frequently Asked Questions | Odysseus AI</title>
        <meta name="description" content="Find answers to frequently asked questions about Odysseus AI installations, Docker, Ollama, and Launch Kits." />
      </Helmet>

      <div className="min-h-screen bg-[#fefaf0] py-12 px-4 md:px-8 font-sans text-[#1A2333]">
        <div className="max-w-4xl mx-auto pt-6">
          
          {/* Header */}
          <div className="mb-12 text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-8">
              <Link to="/" className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-wider hover:text-[#ff2c36] transition-colors">
                <ArrowLeft size={16} />
                Back to Home
              </Link>
            </div>
            
            <div className="neo-card bg-white p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden md:block">
                <HelpCircle size={150} className="text-black" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 relative z-10 text-[#1A2333] uppercase">
                Frequently Asked <span className="underline decoration-wavy decoration-[#ff2c36]">Questions</span>
              </h1>
              <p className="text-base md:text-lg font-medium relative z-10 text-[#475569] max-w-2xl leading-relaxed">
                Find quick answers to common questions about Odysseus AI installations, local model configurations, and our independent guides resource.
              </p>
            </div>
          </div>

          {/* FAQs List */}
          <div className="space-y-12">
            {faqCategories.map((category, catIdx) => (
              <section key={catIdx} className="scroll-mt-24">
                <h2 className="text-2xl font-black mb-6 text-[#1A2333] uppercase tracking-tight">
                  {category.title}
                </h2>
                
                <Accordion type="multiple" className="space-y-4">
                  {category.faqs.map((faq, faqIdx) => (
                    <AccordionItem 
                      key={faqIdx} 
                      value={`item-${catIdx}-${faqIdx}`}
                      className="border-[4px] border-[#1A2333] bg-white shadow-[4px_4px_0px_0px_#1A2333] rounded-[16px] overflow-hidden data-[state=open]:bg-[#fffdfa] transition-all"
                    >
                      <AccordionTrigger className="px-6 py-4 font-black text-sm uppercase tracking-wider text-[#1A2333] hover:no-underline hover:text-[#ff2c36] transition-colors border-none">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 text-sm font-semibold leading-relaxed bg-[#fffdfb] border-t-2 border-[#1A2333]">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>

          {/* Still Need Help CTA */}
          <div className="mt-16 bg-[#fff5ea] neo-card p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-black mb-4 uppercase text-[#1A2333]">Still have questions?</h3>
            <p className="text-sm md:text-base font-semibold mb-8 max-w-xl mx-auto text-[#475569] leading-relaxed">
              If your install setup is still failing or your uvicorn server has port conflicts, check out our Error Doctor.
            </p>
            <Link to="/odysseus-fix" className="neo-button bg-[#ffeb3b] text-black">
              Fix Problems Now
            </Link>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default FAQPage;
