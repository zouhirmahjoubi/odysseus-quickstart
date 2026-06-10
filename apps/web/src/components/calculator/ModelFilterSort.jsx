
import React, { useState, useEffect } from 'react';

const ModelFilterSort = ({ models, selectedVram, onUpdate }) => {
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showIncompatible, setShowIncompatible] = useState(false);
  const [sortBy, setSortBy] = useState('vram_asc');

  useEffect(() => {
    let filtered = [...models];

    // Filter by Type
    if (typeFilter !== 'All') {
      filtered = filtered.filter(m => (m.type || 'LLM') === typeFilter);
    }

    // Filter by Status / Compatibility
    if (!showIncompatible) {
      filtered = filtered.filter(m => m.totalRequired <= selectedVram);
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(m => {
        const isCompatible = m.totalRequired <= selectedVram;
        const currentStatus = isCompatible ? 'Recommended' : 'Not Compatible';
        return currentStatus === statusFilter;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'vram_asc') return a.totalRequired - b.totalRequired;
      if (sortBy === 'vram_desc') return b.totalRequired - a.totalRequired;
      if (sortBy === 'provider_asc') return (a.provider || 'Open Source').localeCompare(b.provider || 'Open Source');
      if (sortBy === 'category') return (a.category || '').localeCompare(b.category || '');
      return 0;
    });

    onUpdate(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [models, typeFilter, statusFilter, showIncompatible, sortBy, selectedVram]); 
  // Omitted onUpdate to prevent re-render loops if the parent function reference changes

  return (
    <div className="bg-[hsl(var(--background))] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] p-4 text-[hsl(var(--foreground))] flex flex-col xl:flex-row gap-4 justify-between items-center mb-6">
      <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
        <label className="font-bold whitespace-nowrap flex items-center">
          Type:
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="ml-2 border-[2px] border-black p-2 bg-[hsl(var(--card))] text-[hsl(var(--foreground))] cursor-pointer shadow-[2px_2px_0px_0px_#000000] focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <option value="All">All Types</option>
            <option value="LLM">LLM</option>
            <option value="Code">Code</option>
          </select>
        </label>

        <label className="font-bold whitespace-nowrap flex items-center">
          Status:
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="ml-2 border-[2px] border-black p-2 bg-[hsl(var(--card))] text-[hsl(var(--foreground))] cursor-pointer shadow-[2px_2px_0px_0px_#000000] focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <option value="All">All Statuses</option>
            <option value="Recommended">Recommended</option>
            <option value="Not Compatible">Not Compatible</option>
          </select>
        </label>

        <label className="flex items-center gap-2 font-bold cursor-pointer whitespace-nowrap border-[2px] border-black bg-[hsl(var(--card))] p-2 shadow-[2px_2px_0px_0px_#000000] hover:-translate-y-0.5 transition-transform focus-within:ring-2 focus-within:ring-black">
          <input 
            type="checkbox" 
            checked={showIncompatible} 
            onChange={(e) => setShowIncompatible(e.target.checked)}
            className="w-5 h-5 border-[2px] border-black appearance-none checked:bg-black checked:after:content-['✓'] checked:after:text-white flex items-center justify-center cursor-pointer focus:outline-none"
          />
          Show Incompatible
        </label>
      </div>

      <div className="flex items-center w-full xl:w-auto mt-4 xl:mt-0">
        <label className="font-bold w-full xl:w-auto whitespace-nowrap flex items-center">
          Sort By:
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="ml-2 border-[2px] border-black p-2 bg-[hsl(var(--card))] text-[hsl(var(--foreground))] cursor-pointer shadow-[2px_2px_0px_0px_#000000] focus:outline-none focus-visible:ring-2 focus-visible:ring-black w-full xl:w-auto"
          >
            <option value="vram_asc">Req. VRAM (Low to High)</option>
            <option value="vram_desc">Req. VRAM (High to Low)</option>
            <option value="provider_asc">Provider (A-Z)</option>
            <option value="category">Category</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default ModelFilterSort;
