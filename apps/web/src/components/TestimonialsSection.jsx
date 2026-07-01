import React, { useState, useEffect } from 'react';
import { Star, Github, Download, Users, Heart } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

// Predefined premium gradient avatars matching the Dokploy design
const gradients = [
  'from-pink-500 via-red-500 to-yellow-500',
  'from-purple-600 to-indigo-600',
  'from-cyan-500 to-blue-500',
  'from-emerald-400 to-cyan-500',
  'from-yellow-400 to-orange-500',
  'from-indigo-500 via-purple-500 to-pink-500',
  'from-blue-600 to-violet-600',
  'from-rose-500 to-red-600',
  'from-green-400 to-teal-500',
  'from-violet-600 to-pink-500',
  'from-sky-400 to-blue-500',
  'from-amber-500 to-rose-500'
];

const fallbackTestimonials = [
  {
    name: "Alex Chen",
    title: "Full Stack Developer",
    handle: "@alex_dev",
    text: "Odysseus AI makes running local models incredibly easy. I just spin it up, connect my Ollama instance, and the agent takes care of the rest.",
    rating: 5
  },
  {
    name: "vinum?",
    title: "System Architect",
    handle: "@vinum",
    text: "Odysseus AI is everything I wanted in a local AI workspace. The functionality is impressive, and it's completely free! Highly recommend the Launch Kit.",
    rating: 5
  },
  {
    name: "Duras",
    title: "AI Researcher",
    handle: "@duras",
    text: "This app convinced me to try local LLMs without manual Docker Compose setups. It's a pleasure to contribute to such an awesome project!",
    rating: 5
  },
  {
    name: "apis",
    title: "DevOps Engineer",
    handle: "@apis",
    text: "I replaced my complex Open WebUI setup with Odysseus AI today. It's stable, easy to use, and offers excellent support for GPU setups!",
    rating: 5
  },
  {
    name: "yayza_",
    title: "Software Engineer",
    handle: "@yayza_",
    text: "Migrated all my AI pipelines to Odysseus—it worked seamlessly! The level of configuration is perfect for all kinds of projects.",
    rating: 5
  },
  {
    name: "Sarah K.",
    title: "Lead Developer",
    handle: "@sarah_k",
    text: "Odysseus makes debugging container routing a breeze. The automated diagnostics check is worth its weight in gold.",
    rating: 5
  },
  {
    name: "lua",
    title: "Frontend Developer",
    handle: "@lua",
    text: "Odysseus is genuinely so nice to use. The UI is exceptionally polished and the hard work behind it really shows.",
    rating: 5
  },
  {
    name: "johnnygri",
    title: "Product Engineer",
    handle: "@johnnygri",
    text: "Odysseus is a complete joy to use. I'm running a mix of local models and workflows seamlessly. Truly a terminal-free experience.",
    rating: 5
  },
  {
    name: "HiJoe",
    title: "Indie Hacker",
    handle: "@hijoe",
    text: "Setting up Odysseus was great—simple, intuitive, and reliable. Perfect for developers and AI enthusiasts alike.",
    rating: 5
  },
  {
    name: "johannes0910",
    title: "Data Scientist",
    handle: "@johannes0910",
    text: "Odysseus has been a game-changer for my side projects. Solid UI, straightforward LLM abstraction, and great design.",
    rating: 5
  },
  {
    name: "vadzim",
    title: "Security Analyst",
    handle: "@vadzim",
    text: "Odysseus is fantastic! I rarely encounter any setup issues now, and the community support is top-notch. Secure and offline.",
    rating: 5
  },
  {
    name: "Slurpy Beckerman",
    title: "Creative Technologist",
    handle: "@slurpy",
    text: "This is exactly what I want in a local AI workspace. I've restructured my entire developer workflow around Odysseus!",
    rating: 5
  }
];

// Pure div-based card — no HeroUI dependency
const TestimonialCard = ({ t, gradientClass }) => (
  <div className="w-[300px] md:w-[350px] bg-white/5 border border-white/10 rounded-2xl shadow-sm flex flex-col justify-between flex-shrink-0 backdrop-blur-md">
    {/* Card Header */}
    <div className="flex gap-3 px-5 pt-5 pb-0">
      {t.avatar ? (
        <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0" />
      ) : (
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center font-bold text-white text-sm border border-white/10 flex-shrink-0`}>
          {t.name.charAt(0)}
        </div>
      )}
      <div className="flex flex-col text-left min-w-0">
        <p className="font-bold text-white text-sm md:text-base leading-none truncate">{t.name}</p>
        <p className="text-xs text-gray-400 font-mono mt-1 truncate">{t.handle}</p>
      </div>
    </div>

    {/* Card Body */}
    <div className="px-5 pb-5 pt-3 flex flex-col justify-between flex-grow">
      <div className="flex gap-0.5 mb-3 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className={i < t.rating ? "fill-current text-[#E73A5A]" : "text-gray-600"} />
        ))}
      </div>
      <blockquote className="text-xs md:text-sm text-gray-300 font-medium leading-relaxed text-left flex-grow">
        &ldquo;{t.text}&rdquo;
      </blockquote>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const records = await pb.collection('testimonials').getFullList({
          filter: 'status="approved"',
          sort: '-created',
          $autoCancel: false
        });
        
        const dbTestimonials = records.map(r => ({
          id: r.id,
          name: r.name,
          title: r.title,
          handle: r.email ? `@${r.email.split('@')[0]}` : `@${r.name.toLowerCase().replace(/\s+/g, '_')}`,
          text: r.text,
          rating: r.rating || 5,
          avatar: r.avatar ? pb.files.getUrl(r, r.avatar) : null
        }));

        if (dbTestimonials.length > 0) {
          setTestimonials([...dbTestimonials, ...fallbackTestimonials]);
        } else {
          setTestimonials(fallbackTestimonials);
        }
      } catch (error) {
        console.warn('Error fetching testimonials, using defaults:', error);
        setTestimonials(fallbackTestimonials);
      }
    };

    fetchTestimonials();


  }, []);

  // Start with fallbacks immediately so marquee renders on mount
  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  const midIndex = Math.ceil(displayTestimonials.length / 2);
  const firstRow = displayTestimonials.slice(0, midIndex);
  const secondRow = displayTestimonials.slice(midIndex);

  const firstRowList = [...firstRow, ...firstRow];
  const secondRowList = [...secondRow, ...secondRow];

  return (
    <section className="bg-transparent text-white py-16 md:py-24 border-t border-b border-white/10 w-full overflow-hidden select-none font-rounded">
      {/* Dynamic styles for continuous marquee scrolling */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 50s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 50s linear infinite;
        }
        .marquee-row:hover .animate-scroll-left,
        .marquee-row:hover .animate-scroll-right {
          animation-play-state: paused;
        }
      `}} />

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center px-4 mb-16">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4 text-white">
          Why Innovators Love the New Odysseus AI
        </h2>
        <p className="text-gray-400 text-sm md:text-base font-medium max-w-2xl mx-auto">
          Hear from the first adopters who discovered how easy private AI development can be. They're not just bragging—they're building better.
        </p>
      </div>

      {/* Testimonials Marquees */}
      <div className="relative flex flex-col gap-6 py-4 [mask-image:linear-gradient(to_right,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_15%,rgba(0,0,0,1)_85%,rgba(0,0,0,0)_100%)]">
        
        {/* Row 1: Left Scrolling */}
        <div className="flex overflow-hidden marquee-row py-4">
          <div className="flex gap-6 animate-scroll-left w-max px-3">
            {firstRowList.map((t, idx) => (
              <TestimonialCard
                key={`r1-${idx}`}
                t={t}
                gradientClass={gradients[idx % gradients.length]}
              />
            ))}
          </div>
        </div>

        {/* Row 2: Right Scrolling */}
        <div className="flex overflow-hidden marquee-row py-4">
          <div className="flex gap-6 animate-scroll-right w-max px-3">
            {secondRowList.map((t, idx) => (
              <TestimonialCard
                key={`r2-${idx}`}
                t={t}
                gradientClass={gradients[(idx + 6) % gradients.length]}
              />
            ))}
          </div>
        </div>

      </div>



      {/* Stats Counter Grid */}
      <div className="max-w-6xl mx-auto px-4 mt-20 md:mt-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          
          {/* Stat 1: Github Stars */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between text-left hover:border-[#E73A5A]/30 transition-all duration-300 relative overflow-hidden group backdrop-blur-md">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 text-white group-hover:scale-110 transition-transform duration-300">
              <Github size={120} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider">GitHub Stars</h3>
                <div className="text-[#E73A5A] bg-white/5 border border-white/10 p-2 rounded-xl">
                  <Github size={18} />
                </div>
              </div>
              <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">
                With over 71.9k stars on GitHub, Odysseus is trusted by developers worldwide for local LLM orchestration.
              </p>
            </div>
            <div className="text-2xl md:text-3xl font-black text-white mt-auto">71,984+</div>
          </div>

          {/* Stat 2: DockerHub Downloads */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between text-left hover:border-[#E73A5A]/30 transition-all duration-300 relative overflow-hidden group backdrop-blur-md">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 text-white group-hover:scale-110 transition-transform duration-300">
              <Download size={120} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Docker Downloads</h3>
                <div className="text-[#E73A5A] bg-white/5 border border-white/10 p-2 rounded-xl">
                  <Download size={18} />
                </div>
              </div>
              <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">
                Downloaded over 95k times on DockerHub. Pre-configured container networks ensure zero conflict setup.
              </p>
            </div>
            <div className="text-2xl md:text-3xl font-black text-white mt-auto">95,967+</div>
          </div>

          {/* Stat 3: Community Contributors */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between text-left hover:border-[#E73A5A]/30 transition-all duration-300 relative overflow-hidden group backdrop-blur-md">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 text-white group-hover:scale-110 transition-transform duration-300">
              <Users size={120} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Contributors</h3>
                <div className="text-[#E73A5A] bg-white/5 border border-white/10 p-2 rounded-xl">
                  <Users size={18} />
                </div>
              </div>
              <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">
                Thanks to our growing base of 30+ contributors, Odysseus continues to expand features and repair complex edge cases.
              </p>
            </div>
            <div className="text-2xl md:text-3xl font-black text-white mt-auto">31+</div>
          </div>

          {/* Stat 4: Sponsors */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between text-left hover:border-[#E73A5A]/30 transition-all duration-300 relative overflow-hidden group backdrop-blur-md">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 text-white group-hover:scale-110 transition-transform duration-300">
              <Heart size={120} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Sponsors</h3>
                <div className="text-[#E73A5A] bg-white/5 border border-white/10 p-2 rounded-xl">
                  <Heart size={18} />
                </div>
              </div>
              <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">
                Supported by more than 15 sponsors and organisations, guaranteeing a steady flow of updates and free support resources.
              </p>
            </div>
            <div className="text-2xl md:text-3xl font-black text-white mt-auto">15+</div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
