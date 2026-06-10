
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      toast.success("Message sent successfully. Our enterprise team will be in touch soon.");
      setIsSubmitting(false);
      e.target.reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <Helmet>
        <title>Contact Us | OdysseusAI</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbNav />
        
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-balance">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Get in touch with the World #1 Digital Marketplace team. We provide dedicated support for enterprise deployments and strategic partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 bg-card border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold text-foreground">Full Name</Label>
                  <Input id="name" required placeholder="Maya Chen" className="bg-background text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold text-foreground">Email Address</Label>
                  <Input id="email" type="email" required placeholder="maya@meridianlabs.com" className="bg-background text-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="font-semibold text-foreground">Subject</Label>
                <Input id="subject" required placeholder="Enterprise Licensing Inquiry" className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="font-semibold text-foreground">Message</Label>
                <Textarea id="message" required placeholder="How can we assist your deployment..." rows={6} className="bg-background text-foreground" />
              </div>
              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto px-8">
                {isSubmitting ? 'Sending Request...' : 'Submit Inquiry'}
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-muted/50 border rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Corporate Office</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="text-primary mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-foreground">Email Support</p>
                    <p className="text-muted-foreground text-sm mt-1">support@odysseusai.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-primary mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-foreground">Global Phone</p>
                    <p className="text-muted-foreground text-sm mt-1">+1 (555) 842-9471</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-primary mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-foreground">Headquarters</p>
                    <p className="text-muted-foreground text-sm mt-1">400 Innovation Drive<br/>San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 text-center">
              <h3 className="font-bold text-primary mb-2">Need Immediate Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">Enterprise customers receive priority routing via their dedicated Slack connect channels.</p>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">View SLA Details</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
