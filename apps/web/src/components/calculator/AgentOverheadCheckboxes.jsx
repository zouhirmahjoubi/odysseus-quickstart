
import React from 'react';

const options = [
  { id: 'CrewAI Multi-Agent Setup', overhead: 1.5 },
  { id: 'Microsoft AutoGen Cluster', overhead: 2.0 },
  { id: 'OpenHands Autonomous Sandbox', overhead: 3.5 },
];

const AgentOverheadCheckboxes = ({ values, onChange }) => {
  const toggle = (id, overhead) => {
    const newValues = { ...values };
    if (newValues[id]) {
      delete newValues[id];
    } else {
      newValues[id] = overhead;
    }
    onChange(newValues);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-black mb-4">5. Concurrent Agent Execution Overhead</h2>
      <div className="space-y-3">
        {options.map((opt) => {
          const isChecked = !!values[opt.id];
          return (
            <label 
              key={opt.id} 
              className={`flex items-center gap-4 p-4 border-neo shadow-neo cursor-pointer transition-all hover:-translate-y-1 focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2 ${isChecked ? 'bg-[hsl(var(--highlight-mint))]' : 'bg-[hsl(var(--card-bg))]'}`}
            >
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={isChecked}
                onChange={() => toggle(opt.id, opt.overhead)}
              />
              <div className={`w-6 h-6 border-neo flex items-center justify-center shrink-0 ${isChecked ? 'bg-black text-white' : 'bg-white'}`} aria-hidden="true">
                {isChecked && <span>✓</span>}
              </div>
              <div className="font-bold flex-1">{opt.id}</div>
              <div className="font-bold text-gray-600 bg-white border-neo px-2 py-1 text-sm shrink-0">+{opt.overhead.toFixed(1)}GB VRAM</div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default AgentOverheadCheckboxes;
