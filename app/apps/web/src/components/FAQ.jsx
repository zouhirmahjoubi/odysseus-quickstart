
import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and cryptocurrency payments."
    },
    {
      question: "Can I get a refund?",
      answer: "Yes, we offer a 30-day money-back guarantee on all purchases."
    },
    {
      question: "Do you provide customer support?",
      answer: "Absolutely! Our support team is available 24/7 via email and chat."
    },
    {
      question: "Are the templates customizable?",
      answer: "Yes, all templates come with full source code and are fully customizable."
    },
    {
      question: "How often are new resources added?",
      answer: "We add new templates and resources every week."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, you can access our free tier with limited resources."
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[hsl(var(--why-choose-bg))] section-padding">
      <div className="max-w-[1000px] mx-auto w-full">
        <div className="text-center mb-[40px] md:mb-[60px]">
          <h2 className="space-grotesk text-section font-bold text-[hsl(var(--text-primary))] leading-tight mb-[15px]">
            Frequently Asked Questions
          </h2>
          <p className="text-sub text-[hsl(var(--text-secondary))]">
            Find answers to common questions
          </p>
        </div>

        <div className="max-w-[800px] mx-auto w-full">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-[hsl(var(--card-bg))] border-[3px] border-[hsl(var(--border))] shadow-[var(--shadow-offset)_var(--shadow-offset)_var(--shadow-blur)_0px_hsl(var(--shadow-color))] p-[15px] md:p-[20px] mb-[15px] transition-all duration-300"
            >
              <button 
                className="w-full text-left flex justify-between items-center focus:outline-none min-h-[44px]"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-[14px] md:text-[16px] font-bold text-[hsl(var(--text-primary))] pr-4">
                  {faq.question}
                </span>
                <span className="text-[20px] font-bold text-[hsl(var(--text-primary))] flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-[200px] opacity-100 mt-[15px]' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-body text-[hsl(var(--text-secondary))]">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
