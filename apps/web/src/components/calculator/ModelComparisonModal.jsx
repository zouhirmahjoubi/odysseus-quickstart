
import React from 'react';
import { X } from 'lucide-react';

const ModelComparisonModal = ({ models, onClose, onRemove, onClear }) => {
  if (models.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
    >
      <div className="bg-[hsl(var(--background))] border-[3px] border-black shadow-[8px_8px_0px_0px_#000000] w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col my-8">
        
        <div className="p-4 border-b-[3px] border-black flex justify-between items-center bg-[hsl(var(--highlight-mint))] sticky top-0 z-20">
          <h2 id="comparison-title" className="text-xl md:text-2xl font-black uppercase tracking-tight text-black">
            Compare Models ({models.length}/3)
          </h2>
          <div className="flex gap-4 items-center">
            <button 
              onClick={onClear} 
              className="font-bold hover:underline opacity-80 hover:opacity-100 transition-opacity uppercase text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              Clear All
            </button>
            <button 
              onClick={onClose} 
              className="p-1 hover:bg-black hover:text-white text-black transition-colors border-[2px] border-transparent hover:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0)] hover:shadow-[2px_2px_0px_0px_#FFFFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              aria-label="Close comparison"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-4 md:p-6 overflow-x-auto text-[hsl(var(--foreground))]">
           <table className="w-full text-left border-collapse min-w-[800px]">
             <thead>
               <tr>
                 <th className="p-3 border-[3px] border-black bg-[hsl(var(--card))] w-1/4 sticky left-0 z-10 font-bold uppercase text-sm">Feature Analysis</th>
                 {models.map(m => (
                   <th key={m.id} className="p-4 border-[3px] border-black bg-[hsl(var(--sidebar-bg))] relative shadow-[inset_-2px_-2px_0px_0px_rgba(0,0,0,0.1)] text-black">
                     <div className="flex justify-between items-start">
                       <span className="font-black text-lg md:text-xl leading-tight">{m.name}</span>
                       <button 
                         onClick={() => onRemove(m.id)} 
                         className="p-1 hover:bg-black hover:text-white border-[2px] border-transparent transition-colors rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                         aria-label={`Remove ${m.name}`}
                       >
                         <X size={16}/>
                       </button>
                     </div>
                   </th>
                 ))}
               </tr>
             </thead>
             <tbody>
               {[
                 { label: 'Provider', key: 'provider' },
                 { label: 'Type', key: 'type' },
                 { label: 'Category', key: 'category' },
                 { label: 'Required VRAM', key: 'totalRequired', format: (val) => <span className="font-black text-lg">{val.toFixed(1)} GB</span> },
                 { label: 'Context Window', key: 'contextWindow', format: (val) => val ? `${val.toLocaleString()} tokens` : 'N/A' },
                 { label: 'Quantization Support', key: 'quantizationSupport', format: (val) => Array.isArray(val) ? val.join(', ') : (val || 'Standard formats') },
                 { label: 'Performance Notes', key: 'performanceMetrics', format: (val) => val || 'Varies by hardware' },
                 { label: 'Primary Use Cases', key: 'useCases', format: (val) => Array.isArray(val) ? val.join(', ') : (val || 'General Inference') },
               ].map((row, idx) => (
                 <tr key={idx} className="hover:bg-[hsl(var(--accent))]/10 transition-colors">
                   <td className="p-4 border-[3px] border-black bg-[hsl(var(--card))] font-bold sticky left-0 z-10 text-sm tracking-wide">
                     {row.label}
                   </td>
                   {models.map(m => (
                     <td key={m.id} className="p-4 border-[3px] border-black bg-[hsl(var(--card))] font-medium">
                       {row.format ? row.format(m[row.key] || m[row.label.toLowerCase()]) : (m[row.key] || 'N/A')}
                     </td>
                   ))}
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default ModelComparisonModal;
