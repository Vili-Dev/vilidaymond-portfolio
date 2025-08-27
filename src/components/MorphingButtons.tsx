'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { ArrowRight, Download, Send, Heart, Star } from 'lucide-react';

interface MorphingButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  morphType?: 'expand' | 'pulse' | 'liquid' | 'neural' | 'crystallize';
}

const buttonVariants: Variants = {
  expand: {
    initial: { 
      scale: 1,
      borderRadius: '9999px',
      background: 'linear-gradient(45deg, #DC2626, #B91C1C)'
    } as any,
    hover: { 
      scale: 1.05,
      borderRadius: '12px',
      background: 'linear-gradient(45deg, #B91C1C, #991B1B)',
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    tap: { 
      scale: 0.95,
      borderRadius: '20px'
    }
  },
  pulse: {
    initial: { 
      scale: 1,
      boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.4)'
    } as any,
    hover: {
      scale: [1, 1.05, 1],
      boxShadow: [
        '0 0 0 0 rgba(220, 38, 38, 0.4)',
        '0 0 0 20px rgba(220, 38, 38, 0)',
        '0 0 0 0 rgba(220, 38, 38, 0.4)'
      ],
      transition: {
        duration: 1.5,
        repeat: Infinity
      }
    }
  },
  liquid: {
    initial: {
      borderRadius: '25px'
    } as any,
    hover: {
      borderRadius: ['25px', '40px', '15px', '35px', '25px'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  neural: {
    initial: {
      background: 'linear-gradient(45deg, #DC2626, #B91C1C)',
      backgroundSize: '100% 100%'
    } as any,
    hover: {
      background: [
        'linear-gradient(45deg, #DC2626, #B91C1C)',
        'linear-gradient(90deg, #B91C1C, #991B1B)',
        'linear-gradient(180deg, #991B1B, #7F1D1D)',
        'linear-gradient(270deg, #7F1D1D, #DC2626)',
        'linear-gradient(45deg, #DC2626, #B91C1C)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity
      }
    }
  },
  crystallize: {
    initial: {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
    } as any,
    hover: {
      clipPath: [
        'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
      ],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  }
};

export function MorphingButton({ 
  children, 
  className = '', 
  onClick,
  variant = 'primary',
  morphType = 'expand' 
}: MorphingButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = {
    primary: 'px-8 py-4 bg-gradient-to-r from-primary-red to-primary-darkRed text-secondary-white font-medium',
    secondary: 'px-8 py-4 border border-secondary-gray text-secondary-lightGray',
    ghost: 'px-8 py-4 text-secondary-lightGray hover:text-primary-red'
  };

  return (
    <motion.button
      className={`relative overflow-hidden transition-colors duration-300 ${baseClasses[variant]} ${className}`}
      variants={buttonVariants[morphType]}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative z-10 flex items-center justify-center gap-2"
        animate={{ x: isHovered && morphType === 'expand' ? 5 : 0 }}
      >
        {children}
      </motion.div>
      
      {/* Morphing background effects */}
      {morphType === 'neural' && (
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 0%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 100%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}

interface AnimatedIconButtonProps {
  icon: ReactNode;
  hoverIcon?: ReactNode;
  className?: string;
  onClick?: () => void;
  animationType?: 'rotate' | 'bounce' | 'morph' | 'slide';
}

export function AnimatedIconButton({ 
  icon, 
  hoverIcon, 
  className = '', 
  onClick,
  animationType = 'rotate'
}: AnimatedIconButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const iconVariants = {
    rotate: {
      initial: { rotate: 0, scale: 1 },
      hover: { 
        rotate: 360, 
        scale: 1.1,
        transition: { duration: 0.6 }
      }
    },
    bounce: {
      initial: { y: 0, scale: 1 },
      hover: { 
        y: [-5, 0, -5], 
        scale: 1.1,
        transition: { 
          y: { duration: 0.6, repeat: Infinity },
          scale: { duration: 0.3 }
        }
      }
    },
    morph: {
      initial: { scale: 1, rotateY: 0 },
      hover: { 
        scale: 1.1, 
        rotateY: 180,
        transition: { duration: 0.5 }
      }
    },
    slide: {
      initial: { x: 0 },
      hover: { 
        x: [0, 10, 0],
        transition: { duration: 0.6, repeat: Infinity }
      }
    }
  };

  return (
    <motion.button
      className={`relative p-4 rounded-full bg-secondary-gray/20 hover:bg-primary-red/20 transition-colors duration-300 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        variants={iconVariants[animationType]}
        initial="initial"
        animate={isHovered ? "hover" : "initial"}
      >
        {isHovered && hoverIcon ? hoverIcon : icon}
      </motion.div>
    </motion.button>
  );
}

interface LoadingMorphButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
  loadingText?: string;
}

export function LoadingMorphButton({ 
  children, 
  className = '', 
  onClick,
  isLoading = false,
  loadingText = "Loading..."
}: LoadingMorphButtonProps) {
  return (
    <motion.button
      className={`relative overflow-hidden px-8 py-4 bg-gradient-to-r from-primary-red to-primary-darkRed text-secondary-white font-medium rounded-full ${className}`}
      onClick={onClick}
      disabled={isLoading}
      animate={{
        width: isLoading ? "auto" : "auto",
        background: isLoading 
          ? "linear-gradient(45deg, #B91C1C, #991B1B)" 
          : "linear-gradient(45deg, #DC2626, #B91C1C)"
      }}
      whileHover={{ scale: isLoading ? 1 : 1.05 }}
      whileTap={{ scale: isLoading ? 1 : 0.95 }}
    >
      <motion.div
        animate={{
          opacity: isLoading ? 0 : 1,
          y: isLoading ? -20 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          opacity: isLoading ? 1 : 0,
          y: isLoading ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{ x: isLoading ? 0 : 20 }}
        >
          <motion.div
            className="w-4 h-4 border-2 border-secondary-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          {loadingText}
        </motion.div>
      </motion.div>
    </motion.button>
  );
}

interface GlowButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: string;
}

export function GlowButton({ 
  children, 
  className = '', 
  onClick,
  glowColor = '#DC2626'
}: GlowButtonProps) {
  return (
    <motion.button
      className={`relative px-8 py-4 bg-transparent border border-current rounded-full font-medium transition-all duration-300 ${className}`}
      onClick={onClick}
      whileHover={{
        boxShadow: [
          `0 0 20px ${glowColor}40`,
          `0 0 40px ${glowColor}60`,
          `0 0 20px ${glowColor}40`
        ],
        textShadow: `0 0 10px ${glowColor}`,
      }}
      transition={{
        boxShadow: { duration: 1.5, repeat: Infinity },
        textShadow: { duration: 0.3 }
      }}
      style={{ color: glowColor }}
    >
      <motion.div
        className="relative z-10"
        whileHover={{ scale: 1.02 }}
      >
        {children}
      </motion.div>
      
      <motion.div
        className="absolute inset-0 rounded-full"
        whileHover={{
          background: `radial-gradient(circle, ${glowColor}10 0%, transparent 70%)`
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}