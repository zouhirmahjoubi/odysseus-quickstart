
import React from 'react';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-background neo-border neo-shadow-sm p-8 flex flex-col items-start gap-4">
      <div className="bg-primary p-4 neo-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg] mb-2">
        <Icon size={32} className="text-black" />
      </div>
      <h3 className="text-xl font-black">{title}</h3>
      <p className="font-medium opacity-80 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
