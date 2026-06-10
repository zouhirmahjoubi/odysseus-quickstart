
import React from 'react';
import { LayoutTemplate, Component, ShieldCheck } from 'lucide-react';

const WhyChooseUsSection = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">Why Choose Us</h2>
        <p className="text-xl font-bold max-w-2xl mx-auto text-foreground/80">
          We provide the best tools and resources to help you build faster and better.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="neo-card flex flex-col items-start hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_hsl(var(--shadow-color))] transition-all duration-300">
          <div className="bg-primary text-primary-foreground neo-border p-3 mb-6 shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
            <LayoutTemplate size={32} strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-black uppercase mb-3">Premium Templates</h3>
          <p className="font-bold text-foreground/80">
            High-quality, responsive templates for your next big project.
          </p>
        </div>

        {/* Card 2 */}
        <div className="neo-card flex flex-col items-start hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_hsl(var(--shadow-color))] transition-all duration-300">
          <div className="bg-secondary text-secondary-foreground neo-border p-3 mb-6 shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
            <Component size={32} strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-black uppercase mb-3">UI Kits & Components</h3>
          <p className="font-bold text-foreground/80">
            Ready-to-use components to speed up your development workflow.
          </p>
        </div>

        {/* Card 3 */}
        <div className="neo-card flex flex-col items-start hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_hsl(var(--shadow-color))] transition-all duration-300">
          <div className="bg-muted text-muted-foreground neo-border p-3 mb-6 shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
            <ShieldCheck size={32} strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-black uppercase mb-3">Secure Transactions</h3>
          <p className="font-bold text-foreground/80">
            Safe and encrypted payments for all your digital purchases.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
