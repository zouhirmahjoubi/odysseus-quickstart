
import React from 'react';

const BenefitCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white neo-border neo-shadow-sm p-6 group hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-accent p-3 neo-border rounded-full group-hover:rotate-12 transition-transform">
          <Icon size={24} className="text-black" />
        </div>
        <h3 className="text-lg font-black">{title}</h3>
      </div>
      <p className="font-medium opacity-80">
        {description}
      </p>
    </div>
  );
};

export default BenefitCard;
