
import React, { useState } from 'react';
import { Search } from 'lucide-react';

function SearchBar({ placeholder = "Search anything..." }) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-14 px-6 pr-14 rounded-full border-brutal bg-white text-black placeholder:text-black/40 shadow-brutal focus:outline-none focus:shadow-brutal-lg transition-all duration-200 text-lg"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black rounded-full">
        <Search size={20} className="text-white" />
      </div>
    </div>
  );
}

export default SearchBar;
