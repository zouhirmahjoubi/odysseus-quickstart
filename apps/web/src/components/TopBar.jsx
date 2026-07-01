
import React from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const TopBar = ({ toggleSidebar }) => {
  return (
    <div className="lg:hidden sticky top-0 z-40 w-full h-[50px] md:h-[60px] bg-[#BAE6FD] border-b-[3px] border-[#312E81] shadow-[4px_4px_0px_0px_#312E81] flex items-center justify-between px-[10px] md:px-[15px] transition-all max-w-[100vw] overflow-hidden">
      <button 
        onClick={toggleSidebar}
        className="p-[10px] bg-transparent focus:outline-none flex items-center justify-center text-black active:scale-95 transition-transform min-w-[44px] min-h-[44px]"
        aria-label="Toggle Menu"
      >
        <Menu size={24} strokeWidth={3} />
      </button>
      
      <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
        <h1 className="text-[18px] md:text-[24px] font-bold space-grotesk text-black whitespace-nowrap m-0 leading-none">
          OdysseusAI
        </h1>
      </Link>
      
      <div className="w-[44px] flex-shrink-0"></div> {/* Spacer for centering */}
    </div>
  );
};

export default TopBar;
