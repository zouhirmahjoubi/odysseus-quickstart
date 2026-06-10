
import React from 'react';

const OrangeBadge = () => {
  return (
    <div className="w-full lg:absolute lg:top-[20px] lg:right-[20px] z-10 px-[15px] lg:px-0 mt-[15px] lg:mt-0 text-center lg:text-right mb-[15px] lg:mb-0 lg:w-auto">
      <div className="inline-block w-full sm:w-auto bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-bold space-grotesk text-[12px] md:text-[14px] px-[15px] py-[10px] md:px-[20px] md:py-[10px] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000]">
        World #1 Digital Marketplace
      </div>
    </div>
  );
};

export default OrangeBadge;
