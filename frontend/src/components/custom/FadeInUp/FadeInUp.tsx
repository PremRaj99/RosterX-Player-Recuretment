import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeInUpProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeInUp({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  ...props
}: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        duration: duration,
        delay: delay,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
