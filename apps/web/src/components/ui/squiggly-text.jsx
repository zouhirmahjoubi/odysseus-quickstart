"use client";

import React, { useState, useEffect, useId } from "react";

export function SquigglyText({
  children,
  steps = 5,
  stepDuration = 80,
  scale = [6, 8],
  baseFrequency = 0.02,
  numOctaves = 3,
  className = "",
  as: Component = "span"
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const id = useId();
  // Safe normalization of unique ID to avoid colon characters breaking CSS url() selectors
  const filterBaseId = `squiggly-filter-${id.replace(/:/g, "")}`;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps);
    }, stepDuration);

    return () => clearInterval(interval);
  }, [steps, stepDuration]);

  // Generate SVG filters for each animation step
  const filters = Array.from({ length: steps }).map((_, index) => {
    // Alternates scale if scale is a tuple, otherwise uses the number
    const activeScale = Array.isArray(scale)
      ? scale[index % scale.length]
      : scale;

    // We vary seed slightly for each filter step to produce distinct turbulence patterns
    const seed = index + 1;

    return (
      <filter
        key={index}
        id={`${filterBaseId}-${index}`}
        x="-10%"
        y="-10%"
        width="120%"
        height="120%"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency={baseFrequency}
          numOctaves={numOctaves}
          seed={seed}
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={activeScale}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    );
  });

  return (
    <>
      {/* Invisible global SVG containing the step filters for this instance */}
      <svg
        style={{
          border: 0,
          clip: "rect(0 0 0 0)",
          height: "1px",
          margin: "-1px",
          overflow: "hidden",
          padding: 0,
          position: "absolute",
          whiteSpace: "nowrap",
          width: "1px"
        }}
      >
        <defs>{filters}</defs>
      </svg>
      <Component
        className={className}
        style={{
          filter: `url(#${filterBaseId}-${activeIndex})`,
          display: "inline-block"
        }}
      >
        {children}
      </Component>
    </>
  );
}
