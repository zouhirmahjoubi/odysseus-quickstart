
import React from 'react';

function NeoBrutalInput({ 
  label, 
  id, 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  className = '',
  required = false
}) {
  return (
    <div className={`flex flex-col gap-2 w-full max-w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="font-medium text-white text-[14px] md:text-[15px]">
          {label} {required && <span className="text-[#E73A5A]">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full min-h-[44px] p-[12px_16px] border border-white/12 bg-white/6 text-white text-[15px] font-medium placeholder:text-gray-500 focus:outline-none transition-all duration-200 focus:border-[#E73A5A] focus:ring-2 focus:ring-[#E73A5A]/20 rounded-[10px] appearance-none"
      />
    </div>
  );
}

export default NeoBrutalInput;
