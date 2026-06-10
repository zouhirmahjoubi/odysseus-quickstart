
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="neo-border neo-shadow bg-white overflow-hidden mb-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 md:p-6 bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-lg md:text-xl font-bold text-left text-black pr-4">
          {question}
        </span>
        <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-black flex items-center justify-center bg-white">
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="border-t-[3px] border-black bg-[#FFFDE6] p-5 md:p-6">
              <p className="text-base md:text-lg font-medium text-black leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AccordionItem;
