
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Gamepad2 } from 'lucide-react';

const LogoComponent = () => {
  return (
    <Link to="/" className="inline-flex items-center gap-3 group transition-transform hover:scale-[1.02]">
      <div className="flex items-center gap-2">
        <div className="neo-icon-box bg-card group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 group-hover:shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
          <Menu size={24} strokeWidth={3} className="text-foreground" />
        </div>
        <div className="neo-icon-box bg-primary group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 group-hover:shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
          <Gamepad2 size={24} strokeWidth={3} className="text-foreground" />
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center leading-none">
          <span className="font-black text-2xl md:text-3xl tracking-tight text-foreground uppercase">ODYSSEUS</span>
          <div className="ml-1.5 bg-accent border-4 border-border px-1.5 py-0.5 rounded-[4px] shadow-[2px_2px_0px_0px_hsl(var(--shadow-color))] transform -skew-x-6">
            <span className="font-black text-lg md:text-xl text-foreground uppercase leading-none">AI</span>
          </div>
        </div>
        <span className="font-bold text-accent text-xs md:text-sm tracking-widest mt-0.5">AI.AI</span>
      </div>
    </Link>
  );
};

export default LogoComponent;
