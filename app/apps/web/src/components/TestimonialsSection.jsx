
import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const records = await pb.collection('testimonials').getList(1, 5, {
          filter: 'status="approved" && featured=true',
          sort: '-created',
          $autoCancel: false
        });
        setTestimonials(records.items);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  if (loading) return <div className="py-20 text-center font-bold">Loading testimonials...</div>;
  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <section className="py-16 md:py-24 w-full overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black space-grotesk inline-block border-b-[3px] border-black pb-2">
          Trusted by Innovators
        </h2>
      </div>

      <div className="max-w-4xl mx-auto relative px-4 md:px-12">
        <div className="neo-testimonial-card bg-[var(--accent-pale-yellow)] dark:bg-[hsl(var(--card))] relative z-10">
          <Quote size={48} className="absolute top-6 right-6 text-black/10 dark:text-white/10" />
          
          <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={24} 
                className={i < current.rating ? "fill-black text-black dark:fill-white dark:text-white" : "text-gray-300"} 
              />
            ))}
          </div>
          
          <p className="text-xl md:text-3xl font-bold space-grotesk leading-relaxed mb-8">
            "{current.text}"
          </p>
          
          <div className="flex items-center gap-4 mt-auto">
            <div className="w-16 h-16 rounded-none neo-border bg-[var(--accent-sky)] overflow-hidden">
              {current.avatar ? (
                <img src={pb.files.getUrl(current, current.avatar)} alt={current.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-xl">
                  {current.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-black text-lg">{current.name}</h4>
              <p className="font-bold text-gray-600 dark:text-gray-400">{current.title}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {testimonials.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white neo-border neo-shadow flex items-center justify-center z-20 hover:bg-[var(--accent-mint)] transition-colors active:translate-y-1 active:shadow-none"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white neo-border neo-shadow flex items-center justify-center z-20 hover:bg-[var(--accent-mint)] transition-colors active:translate-y-1 active:shadow-none"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-4 h-4 neo-border transition-colors ${currentIndex === idx ? 'bg-black' : 'bg-white'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
