
import React from 'react';

function NeoBrutalTextarea({ 
  label, 
  id, 
  value, 
  onChange, 
  placeholder, 
  rows = 5,
  className = '',
  required = false
}) {
  return (
    <div className={`flex flex-col gap-2 w-full max-w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="font-bold text-[hsl(var(--foreground))] text-[14px] md:text-[16px]">
          {label} {required && <span className="text-[hsl(var(--destructive))]">*</span>}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full min-h-[120px] p-[12px_15px] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] text-[14px] md:text-[16px] font-medium placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-0 transition-all duration-200 focus:shadow-[6px_6px_0px_0px_#000000] focus:-translate-y-[2px] focus:-translate-x-[2px] resize-y overflow-y-auto rounded-none appearance-none"
      />
    </div>
  );
}

export default NeoBrutalTextarea;
