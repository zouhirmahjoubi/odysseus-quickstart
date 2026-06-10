
import React from 'react';
import { motion } from 'framer-motion';

const GradientCard = ({ children, variant = 'primary', className = '', ...props }) => {
  const gradientClass = 
    variant === 'primary' ? 'gradient-primary' : 
    variant === 'secondary' ? 'gradient-secondary' : 
    'gradient-accent';

  return (
    <motion.div 
      className={`border-admin shadow-admin p-6 text-white ${gradientClass} ${className}`}
      whileHover={{ y: -4, x: -4, boxShadow: '8px 8px 0px 0px #000000' }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GradientCard;
