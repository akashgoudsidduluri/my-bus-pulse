import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ParallaxContainerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxContainer({ 
  children, 
  speed = 0.5,
  className = ""
}: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);
  
  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

interface ParallaxElementProps {
  children: ReactNode;
  speed?: number;
  direction?: 'up' | 'down';
  className?: string;
}

export function ParallaxElement({ 
  children, 
  speed = 0.3,
  direction = 'up',
  className = ""
}: ParallaxElementProps) {
  const { scrollYProgress } = useScroll();
  const yRange = direction === 'up' ? [0, -speed * 100] : [0, speed * 100];
  const y = useTransform(scrollYProgress, [0, 1], yRange);
  
  return (
    <motion.div 
      style={{ y }} 
      className={className}
    >
      {children}
    </motion.div>
  );
}