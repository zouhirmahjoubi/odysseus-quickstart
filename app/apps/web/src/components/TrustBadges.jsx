
import React from 'react';

const TrustBadges = () => {
  const badges = [
    "📜 License: MIT (Open Source)",
    "🔍 Telemetry: 0% Tracker Footprint",
    "📦 Dependencies: Python 3.11+ / Ollama"
  ];

  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-[10px] lg:gap-[15px] mt-[20px] lg:mt-[30px] w-full max-w-full">
      {badges.map((badge, index) => (
        <div 
          key={index}
          className="bg-[hsl(var(--card))] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] p-[10px_15px] lg:p-[12px_20px] w-full md:w-auto text-center lg:text-left font-bold space-grotesk text-[12px] lg:text-[14px] text-[hsl(var(--card-foreground))] transition-all duration-300 hover:shadow-[6px_6px_0px_0px_#000000] hover:scale-105 hover:-translate-y-[2px]"
        >
          {badge}
        </div>
      ))}
    </div>
  );
}

export default TrustBadges;
