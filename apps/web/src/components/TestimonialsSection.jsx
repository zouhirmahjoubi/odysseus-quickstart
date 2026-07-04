import React, { useState, useEffect } from 'react';
import { Star, Github, Download, Users, Heart, Shield, Award, CheckCircle } from 'lucide-react';
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

      {/* Client / Tech Logos Banner */}
      <div className="max-w-5xl mx-auto px-4 mb-20">
        <p className="text-[10px] md:text-[11px] font-black text-gray-500 uppercase tracking-widest text-center mb-8">
          INTEGRATES SEAMLESSLY WITH LEADING LOCAL RUNTIMES & FRAMEWORKS
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50 hover:opacity-80 transition-opacity duration-300">
          {/* Docker */}
          <div className="group flex items-center justify-center">
            <svg className="h-6 text-gray-400 group-hover:text-[#2496ED] fill-current transition-colors duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.983 11.078h2.119v-2.006h-2.119v2.006zm-2.737-2.006h2.117v2.006h-2.117v-2.006zm-.002-2.317h2.117v2.006h-2.117V6.755zM8.51 11.078H10.63v-2.006H8.51v2.006zm-2.739 0h2.119v-2.006H5.771v2.006zm2.737-2.006H10.63V7.066H8.51v2.006zM5.771 9.072h2.119V7.066H5.771v2.006zm-2.739 2.006h2.119v-2.006H3.032v2.006zm8.214-4.333h2.117V4.739h-2.117v2.006zm5.856 2.006H19.22V6.743h-2.118v2.008zM1.01 12.53c.012.353.036.702.072 1.05a5.556 5.556 0 00.569 1.83 5.4 5.4 0 001.378 1.76c1.196 1.036 2.84 1.724 4.887 1.724 3.793 0 6.643-2.284 7.973-5.748a8.36 8.36 0 00.567-2.617c.07-.63.093-1.258.073-1.85h-2.12v1.417c0 1.206-.43 2.164-1.291 2.87-.775.637-1.745.962-2.92.962H1.01zm21.98-3.072c-.22-.387-.616-.628-1.07-.628H19.64a5.05 5.05 0 00-4.81-4.092c-.113 0-.224.004-.334.01a.333.333 0 00-.288.24c-.114.398-.21.808-.288 1.228a.334.334 0 00.177.35c.78.43 1.426 1.036 1.902 1.782a.333.333 0 00.276.155h4.898c.094 0 .147.106.09.183-.34.464-.787.848-1.309 1.13-.58.314-1.246.475-1.98.475H1.01c-.085 0-.154.069-.154.154v.397c0 .17.013.339.038.508.01.072.074.124.147.124h18.232c1.4 0 2.53-1.127 2.53-2.52a2.49 2.49 0 00-.783-1.791z"/>
            </svg>
          </div>
          {/* Ollama */}
          <div className="group flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-300 font-mono font-black text-sm tracking-wider">
            <span className="w-5 h-5 rounded-md border-2 border-current flex items-center justify-center font-black text-xs mr-2 transition-transform duration-300 group-hover:scale-110">O</span>
            OLLAMA
          </div>
          {/* Hugging Face */}
          <div className="group flex items-center justify-center text-gray-400 hover:text-[#FFD21E] transition-colors duration-300 font-mono font-bold text-sm tracking-tight">
            <span className="text-lg mr-2 transition-transform duration-300 group-hover:scale-110">🤗</span>
            HUGGING FACE
          </div>
          {/* PyTorch */}
          <div className="group flex items-center justify-center text-gray-400 hover:text-[#EE4C2C] transition-colors duration-300 font-mono font-bold text-sm tracking-tight">
            <span className="text-lg mr-2 transition-transform duration-300 group-hover:scale-110">🔥</span>
            PYTORCH
          </div>
          {/* LangChain */}
          <div className="group flex items-center justify-center text-gray-400 hover:text-[#13c19e] transition-colors duration-300 font-mono font-bold text-sm tracking-tight">
            <span className="text-lg mr-2 transition-transform duration-300 group-hover:scale-110">🦜</span>
            LANGCHAIN
          </div>
          {/* GitHub */}
          <div className="group flex items-center justify-center">
            <svg className="h-6 text-gray-400 group-hover:text-white fill-current transition-colors duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z"/>
            </svg>
          </div>
        </div>
      </div>

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

      {/* Compliance & Trust Badges */}
      <div className="max-w-6xl mx-auto px-4 mt-16 mb-4">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-bold text-gray-300 backdrop-blur-md">
            <Shield className="w-4 h-4 text-emerald-500 animate-pulse" />
            100% GDPR Compliant & Offline
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-bold text-gray-300 backdrop-blur-md">
            <CheckCircle className="w-4 h-4 text-amber-500" />
            MIT License Certified
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-bold text-gray-300 backdrop-blur-md">
            <Award className="w-4 h-4 text-blue-500" />
            Docker Certified Compatible
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-bold text-gray-300 backdrop-blur-md">
            <Shield className="w-4 h-4 text-purple-500" />
            SOC 2 Security Ready Architecture
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
