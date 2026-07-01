import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

// ─── Fade In on Scroll ───
export const FadeIn = ({ children, className = '', delay = 0, duration = 0.6, direction = 'up', distance = 40, once = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '0px 0px 200px 0px' });

  const directionOffset = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { y: 0, x: distance },
    right: { y: 0, x: -distance },
    none: { y: 0, x: 0 },
  };

  const offset = directionOffset[direction] || directionOffset.up;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: offset.x, y: offset.y }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ─── Scale In on Scroll ───
export const ScaleIn = ({ children, className = '', delay = 0, duration = 0.5, once = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '0px 0px 200px 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
      transition={{ duration, delay, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ─── Stagger Container (staggers children on scroll) ───
export const StaggerContainer = ({ children, className = '', staggerDelay = 0.1, once = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '0px 0px 200px 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// ─── Stagger Item (used inside StaggerContainer) ───
export const StaggerItem = ({ children, className = '', direction = 'up', distance = 30 }) => {
  const directionOffset = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { y: 0, x: distance },
    right: { y: 0, x: -distance },
  };
  const offset = directionOffset[direction] || directionOffset.up;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, x: offset.x, y: offset.y },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// ─── Parallax wrapper (moves content at different scroll speed) ───
export const Parallax = ({ children, className = '', speed = 0.3 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

// ─── Reveal (clip-path wipe reveal) ───
export const Reveal = ({ children, className = '', delay = 0, duration = 0.8, once = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '0px 0px 200px 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
      animate={isInView
        ? { clipPath: 'inset(0 0 0% 0)', opacity: 1 }
        : { clipPath: 'inset(0 0 100% 0)', opacity: 0 }
      }
      transition={{ duration, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ─── Float (subtle continuous floating animation) ───
export const Float = ({ children, className = '', amplitude = 8, duration = 4, delay = 0 }) => {
  return (
    <motion.div
      className={className}
      animate={{ y: [-amplitude, amplitude, -amplitude] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};
