
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion.jsx';
import PageTransition from '@/components/PageTransition.jsx';

const FAQPage = () => {
  const faqCategories = [
    {
      title: "Getting Started",
      faqs: [
        {
          question: "How do I create an account?",
          answer: "Click the 'Log In' button in the top right corner and select 'Sign Up'. You can register using your email address or connect quickly using Google, GitHub, or Apple OAuth providers."
        },
        {
          question: "Is it free to join the marketplace?",
          answer: "Yes! Creating a basic account is completely free. You only pay when you purchase premium digital assets or subscribe to advanced platform features."
        },
        {
          question: "How do I set up my profile?",
          answer: "Once logged in, navigate to 'My Profile' from the user dropdown. Here you can upload an avatar, add your bio, set your preferences, and manage your payment methods."
        }
      ]
    },
    {
      title: "Buying",
      faqs: [
        {
          question: "How do I purchase a digital product?",
          answer: "Browse our Store or use the Search function to find an asset. Click 'Add to Cart', proceed to Checkout, and complete your payment securely. Your files will be available for download immediately."
        },
        {
          question: "What payment methods are accepted?",
          answer: "We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, and Apple/Google Pay through our secure Stripe integration."
        },
        {
          question: "Where do I find my purchased items?",
          answer: "All your purchased digital assets are stored in your Dashboard under 'My Downloads' or 'Order History'. You have lifetime access to re-download files you've bought."
        },
        {
          question: "What do the different licenses mean?",
          answer: "A Standard License allows use in one personal or commercial project where end-users don't pay. An Extended License is required if you are building a product where end-users will be charged."
        }
      ]
    },
    {
      title: "Selling",
      faqs: [
        {
          question: "How can I become a seller?",
          answer: "Navigate to your Dashboard and click 'Apply to Sell'. Our team reviews applications within 48 hours to ensure our marketplace maintains high quality standards."
        },
        {
          question: "What are the fees for selling?",
          answer: "We charge a competitive 15% platform fee on all sales. The remaining 85% goes directly to you. High-volume sellers may qualify for reduced commission rates."
        },
        {
          question: "When and how do I get paid?",
          answer: "Earnings are accumulated in your seller account and paid out automatically on the 1st and 15th of every month via PayPal or direct bank transfer (Stripe Connect)."
        }
      ]
    },
    {
      title: "Payment & Refunds",
      faqs: [
        {
          question: "Are my payment details secure?",
          answer: "Absolutely. We do not store your credit card information. All transactions are encrypted and processed through industry-leading payment gateways (Stripe and PayPal)."
        },
        {
          question: "Can I get a refund for a digital download?",
          answer: "Because digital goods cannot be returned, refunds are only issued if the product is fundamentally flawed, misrepresented, or completely broken, and you request it within 14 days."
        },
        {
          question: "How do I request a refund?",
          answer: "Go to your Order History, select the specific order, and click 'Request Refund'. Provide a detailed explanation and any relevant screenshots so our mediation team can review it."
        }
      ]
    },
    {
      title: "Account & Security",
      faqs: [
        {
          question: "How do I reset my password?",
          answer: "On the login page, click 'Forgot Password'. Enter your registered email, and we will send you a secure link to reset your credentials."
        },
        {
          question: "Do you support Two-Factor Authentication (2FA)?",
          answer: "Yes. We highly recommend enabling 2FA for extra security. You can toggle this on in your Profile Settings under the 'Security' tab."
        },
        {
          question: "How do I delete my account?",
          answer: "You can permanently delete your account from the Security tab in your Profile Settings. Please note this action is irreversible and you will lose access to all past purchases."
        }
      ]
    },
    {
      title: "Technical Support",
      faqs: [
        {
          question: "An asset I bought isn't working. What should I do?",
          answer: "First, check the documentation provided by the author. If you still have issues, use the 'Contact Author' button on the product page to request direct support."
        },
        {
          question: "How do I contact platform support?",
          answer: "For platform-wide issues (billing, account access, reporting), use our Contact page or email support@odysseusai.ai directly. We typically respond within 24 hours."
        }
      ]
    }
  ];

  return (
    <PageTransition>
      <Helmet>
        <title>Frequently Asked Questions | Odysseusai.ai</title>
        <meta name="description" content="Find answers to common questions about buying, selling, and managing your account on Odysseusai.ai." />
      </Helmet>

      <div className="min-h-screen bg-[hsl(var(--background))] py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-12 text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-8">
              <Link to="/" className="inline-flex items-center gap-2 font-bold hover:text-[hsl(var(--primary))] transition-colors">
                <ArrowLeft size={20} />
                Back to Home
              </Link>
            </div>
            
            <div className="bg-[hsl(var(--card))] border-[4px] border-[hsl(var(--border))] shadow-[12px_12px_0px_0px_hsl(var(--border))] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden md:block">
                <HelpCircle size={180} />
              </div>
              <h1 className="text-4xl md:text-5xl font-black space-grotesk mb-4 relative z-10 text-[hsl(var(--foreground))]">
                Frequently Asked <span className="text-[hsl(var(--primary))]">Questions</span>
              </h1>
              <p className="text-lg md:text-xl font-medium relative z-10 text-[hsl(var(--muted-foreground))] text-gray-700 max-w-2xl">
                Need help? Find quick answers to your questions about our marketplace, purchasing assets, selling, and platform features.
              </p>
            </div>
          </div>

          {/* FAQs List */}
          <div className="space-y-12">
            {faqCategories.map((category, catIdx) => (
              <section key={catIdx} className="scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-black space-grotesk mb-6 text-[hsl(var(--foreground))] border-b-[4px] border-[hsl(var(--secondary))] inline-block pb-1">
                  {category.title}
                </h2>
                
                <Accordion type="multiple" className="space-y-4">
                  {category.faqs.map((faq, faqIdx) => (
                    <AccordionItem 
                      key={faqIdx} 
                      value={`item-${catIdx}-${faqIdx}`}
                      className="border-[3px] border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[4px_4px_0px_0px_hsl(var(--border))] rounded-none data-[state=open]:bg-[hsl(var(--background))] transition-colors"
                    >
                      <AccordionTrigger className="px-6 py-4 font-bold text-lg text-left hover:no-underline hover:text-[hsl(var(--primary))] transition-colors data-[state=open]:border-b-[3px] data-[state=open]:border-[hsl(var(--border))]">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 text-base font-medium leading-relaxed bg-[hsl(var(--card))] border-t-0">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>

          {/* Still Need Help CTA */}
          <div className="mt-16 bg-[hsl(var(--secondary))] border-[4px] border-[hsl(var(--border))] shadow-[8px_8px_0px_0px_hsl(var(--border))] p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-black space-grotesk mb-4 text-[hsl(var(--foreground))]">Still have questions?</h3>
            <p className="text-lg font-medium mb-8 max-w-xl mx-auto text-[hsl(var(--foreground))]">
              Can't find the answer you're looking for? Our dedicated support team is here to help you out.
            </p>
            <Link to="/contact" className="inline-block border-[3px] border-[hsl(var(--border))] shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold px-8 py-4 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_hsl(var(--border))] transition-transform text-lg space-grotesk">
              Contact Support
            </Link>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default FAQPage;
