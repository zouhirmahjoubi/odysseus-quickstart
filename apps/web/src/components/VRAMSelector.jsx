
import React, { useState } from 'react';

const VRAMSelector = () => {
  const options = ['12GB', '16GB', '24GB', '48GB', '80GB', '128GB'];
  const [selected, setSelected] = useState('24GB');

  return (
    <div className="bg-white neo-border neo-shadow p-8 mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h3 className="text-2xl font-black mb-2">VRAM Selector</h3>
          <p className="font-medium opacity-80">Target your available hardware memory to filter compatible models.</p>
        </div>
        <div className="bg-primary px-6 py-3 neo-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-sm font-bold uppercase tracking-widest block">Selected</span>
          <span className="text-3xl font-black">{selected}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className={`
              py-4 neo-border text-center font-black text-lg transition-all duration-200
              ${selected === opt 
                ? 'bg-primary shadow-none translate-y-1 translate-x-1' 
                : 'bg-background neo-shadow-sm hover:-translate-y-1 hover:bg-white'}
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VRAMSelector;
