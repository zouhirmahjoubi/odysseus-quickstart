
import React from 'react';
import { Check } from 'lucide-react';

const HardwareCard = ({ name, description, icon: Icon }) => {
  return (
    <div className="bg-background neo-border p-6 relative overflow-hidden group neo-interactive cursor-pointer">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110">
        <Icon size={80} />
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-2">
          <Check size={20} className="text-primary" strokeWidth={4} />
          <h3 className="text-xl font-black">{name}</h3>
        </div>
        <p className="font-medium text-sm opacity-80 mt-2">
          {description}
        </p>
      </div>
    </div>
  );
};

export default HardwareCard;
