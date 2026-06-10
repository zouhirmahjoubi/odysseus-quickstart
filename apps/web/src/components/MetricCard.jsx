
import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ title, value, description, bgColor = '#FFFFFF', icon: Icon }) => {
  return (
    <motion.div 
      className="border-admin shadow-admin p-6 flex flex-col h-full"
      style={{ backgroundColor: bgColor }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold text-black">{title}</h3>
        {Icon && (
          <div className="p-2 bg-white border-admin rounded-full">
            <Icon size={24} className="text-black" />
          </div>
        )}
      </div>
      <div className="mt-auto">
        <p className="text-4xl font-extrabold text-black mb-2">{value}</p>
        {description && <p className="text-black/80 font-bold">{description}</p>}
      </div>
    </motion.div>
  );
};

export default MetricCard;
