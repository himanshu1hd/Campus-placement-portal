/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Share2 } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: { icon: 16, container: 'w-8 h-8', text: 'text-lg', gap: 'gap-2' },
    md: { icon: 24, container: 'w-12 h-12', text: 'text-2xl', gap: 'gap-3' },
    lg: { icon: 32, container: 'w-16 h-16', text: 'text-4xl', gap: 'gap-4' },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center ${currentSize.gap} ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${currentSize.container} bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 relative overflow-hidden group`}
      >
        <motion.div
          initial={{ rotate: -45, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Share2 size={currentSize.icon} strokeWidth={2.5} />
        </motion.div>
        
        {/* Abstract background decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
        <div className="absolute -bottom-1 -left-1 w-1/2 h-1/2 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors" />
      </motion.div>
      
      {showText && (
        <span className={`${currentSize.text} font-black tracking-tighter text-slate-900 flex items-center`}>
          NEXUS
          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full ml-1 mt-auto mb-1.5" />
        </span>
      )}
    </div>
  );
};
