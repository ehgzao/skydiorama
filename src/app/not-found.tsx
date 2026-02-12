'use client';

import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-6xl mb-6"
        >
          🌤️
        </motion.div>
        
        <h1 className="text-2xl font-bold text-white mb-2">
          Page Not Found
        </h1>
        
        <p className="text-white/60 mb-8">
          Oops! This weather scene doesn't exist. Let's get you back to generating beautiful dioramas.
        </p>
        
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Home className="w-5 h-5" />
            Back to SkyDiorama
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
