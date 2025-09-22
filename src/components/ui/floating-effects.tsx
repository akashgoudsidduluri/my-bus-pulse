import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingElementProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  amplitude?: number;
  className?: string;
}

export function FloatingElement({ 
  children, 
  delay = 0,
  duration = 6,
  amplitude = 20,
  className = ""
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
        x: [-amplitude/2, amplitude/2, -amplitude/2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

interface GlowEffectProps {
  children: ReactNode;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function GlowEffect({ 
  children, 
  color = "rgb(59, 130, 246)",
  intensity = 'medium',
  className = ""
}: GlowEffectProps) {
  const glowSizes = {
    low: '10px',
    medium: '20px',
    high: '30px'
  };

  return (
    <motion.div
      className={className}
      style={{
        filter: `drop-shadow(0 0 ${glowSizes[intensity]} ${color})`
      }}
      animate={{
        filter: [
          `drop-shadow(0 0 ${glowSizes[intensity]} ${color})`,
          `drop-shadow(0 0 ${parseInt(glowSizes[intensity]) * 1.5}px ${color})`,
          `drop-shadow(0 0 ${glowSizes[intensity]} ${color})`
        ]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}