import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

interface AnimatedBackgroundProps {
  variant?: 'particles' | 'geometric' | 'mixed';
  intensity?: 'low' | 'medium' | 'high';
  color?: 'blue' | 'cyan' | 'purple';
}

export function AnimatedBackground({ 
  variant = 'mixed', 
  intensity = 'medium',
  color = 'blue'
}: AnimatedBackgroundProps) {
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Intensity settings
  const intensityConfig = {
    low: { count: 15, maxSize: 4 },
    medium: { count: 25, maxSize: 6 },
    high: { count: 40, maxSize: 8 }
  };

  // Color variants
  const colorConfig = {
    blue: {
      primary: 'rgba(59, 130, 246, 0.6)',
      secondary: 'rgba(147, 197, 253, 0.4)',
      accent: 'rgba(29, 78, 216, 0.3)'
    },
    cyan: {
      primary: 'rgba(6, 182, 212, 0.6)',
      secondary: 'rgba(103, 232, 249, 0.4)',
      accent: 'rgba(8, 145, 178, 0.3)'
    },
    purple: {
      primary: 'rgba(147, 51, 234, 0.6)',
      secondary: 'rgba(196, 181, 253, 0.4)',
      accent: 'rgba(109, 40, 217, 0.3)'
    }
  };

  const config = intensityConfig[intensity];
  const colors = colorConfig[color];

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const generateParticles = (): FloatingParticle[] => {
      return Array.from({ length: config.count }, (_, i) => ({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * config.maxSize + 2,
        delay: Math.random() * 5,
        duration: Math.random() * 20 + 15,
        opacity: Math.random() * 0.8 + 0.2
      }));
    };

    if (dimensions.width > 0 && dimensions.height > 0) {
      setParticles(generateParticles());
    }
  }, [dimensions, config]);

  const renderParticles = () => {
    return particles.map((particle) => (
      <motion.div
        key={particle.id}
        className="absolute rounded-full"
        style={{
          width: particle.size,
          height: particle.size,
          background: `radial-gradient(circle, ${colors.primary} 0%, ${colors.secondary} 70%, transparent 100%)`,
          boxShadow: `0 0 ${particle.size * 2}px ${colors.accent}`,
        }}
        initial={{
          x: particle.x,
          y: particle.y,
          opacity: 0,
          scale: 0
        }}
        animate={{
          x: [particle.x, particle.x + 100, particle.x - 50, particle.x],
          y: [particle.y, particle.y - 150, particle.y + 100, particle.y],
          opacity: [0, particle.opacity, particle.opacity, 0],
          scale: [0, 1, 1, 0]
        }}
        transition={{
          duration: particle.duration,
          delay: particle.delay,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    ));
  };

  const renderGeometric = () => {
    return particles.slice(0, Math.floor(config.count / 3)).map((particle) => (
      <motion.div
        key={`geo-${particle.id}`}
        className="absolute"
        style={{
          width: particle.size * 3,
          height: particle.size * 3,
        }}
        initial={{
          x: particle.x,
          y: particle.y,
          opacity: 0,
          rotate: 0
        }}
        animate={{
          x: [particle.x, particle.x + 200, particle.x],
          y: [particle.y, particle.y - 100, particle.y],
          opacity: [0, 0.3, 0],
          rotate: [0, 360]
        }}
        transition={{
          duration: particle.duration * 1.5,
          delay: particle.delay,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Hexagon shape */}
        <div
          className="w-full h-full"
          style={{
            background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            filter: `drop-shadow(0 0 ${particle.size}px ${colors.accent})`
          }}
        />
      </motion.div>
    ));
  };

  const renderLines = () => {
    return particles.slice(0, 5).map((particle) => (
      <motion.div
        key={`line-${particle.id}`}
        className="absolute"
        style={{
          width: '2px',
          height: '100px',
          background: `linear-gradient(to bottom, transparent, ${colors.primary}, transparent)`,
          filter: `blur(1px)`
        }}
        initial={{
          x: particle.x,
          y: -100,
          opacity: 0
        }}
        animate={{
          x: particle.x,
          y: dimensions.height + 100,
          opacity: [0, 0.8, 0]
        }}
        transition={{
          duration: particle.duration / 2,
          delay: particle.delay,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    ));
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient overlay for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.1) 100%)`
        }}
      />
      
      {/* Render based on variant */}
      {(variant === 'particles' || variant === 'mixed') && renderParticles()}
      {(variant === 'geometric' || variant === 'mixed') && renderGeometric()}
      {variant === 'mixed' && renderLines()}
      
      {/* Parallax grid lines */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(${colors.primary} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.primary} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px']
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}