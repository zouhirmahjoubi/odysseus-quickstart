
import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "OdysseusAI transformed how I build projects. The templates saved me weeks of work!",
      author: "Sarah Chen",
      role: "Full Stack Developer"
    },
    {
      quote: "The UI kits are incredibly comprehensive. Exactly what I needed for my startup.",
      author: "Marcus Johnson",
      role: "Product Designer"
    },
    {
      quote: "Best investment I made for my development workflow. Highly recommended!",
      author: "Priya Patel",
      role: "Freelance Developer"
    }
  ];

  return (
    <section className="bg-[hsl(var(--why-choose-bg))] section-padding">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-[40px] md:mb-[60px]">
          <h2 className="space-grotesk text-section font-bold text-[hsl(var(--text-primary))] leading-tight mb-[15px]">
            What Our Users Say
          </h2>
          <p className="text-sub text-[hsl(var(--text-secondary))]">
            Real feedback from real developers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] md:gap-[20px] lg:gap-[30px]">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card-neo-brutal hover-shadow-increase flex flex-col">
              <p className="text-sub italic text-[hsl(var(--text-secondary))] mb-[20px] flex-grow">
                "{testimonial.quote}"
              </p>
              <div className="mt-auto">
                <div className="text-[16px] font-bold text-[hsl(var(--text-primary))]">
                  {testimonial.author}
                </div>
                <div className="text-[14px] text-[hsl(var(--text-secondary))] mb-[10px]">
                  {testimonial.role}
                </div>
                <div className="text-[16px]">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
