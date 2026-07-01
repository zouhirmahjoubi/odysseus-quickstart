import React from 'react';
import { Link } from 'react-router-dom';

const LogoComponent = ({ onClick }) => {
  return (
    <Link 
      to="/" 
      onClick={onClick}
      title="Go to Homepage"
      className="inline-flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 focus:outline-none select-none font-bold text-lg md:text-xl uppercase tracking-wider text-white"
    >
      <svg className="w-5 h-5 text-[#E73A5A]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L2 22h20L12 2zm0 4l7.5 13h-15L12 6z" />
      </svg>
      <span>ODYSSEUSAI.AI</span>
    </Link>
  );
};

export default LogoComponent;
