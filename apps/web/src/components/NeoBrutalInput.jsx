
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
        <label htmlFor={id} className="font-bold text-[hsl(var(--foreground))] text-[14px] md:text-[16px]">
          {label} {required && <span className="text-[hsl(var(--primary))]">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full min-h-[44px] p-[12px_16px] border-[3px] border-[hsl(var(--border))] shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] text-[16px] font-medium placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-0 transition-all duration-200 focus:shadow-[6px_6px_0px_0px_hsl(var(--secondary))] focus:border-[hsl(var(--secondary))] focus:-translate-y-[2px] focus:-translate-x-[2px] rounded-[var(--radius)] appearance-none"
      />
    </div>
  );
}

export default NeoBrutalInput;
