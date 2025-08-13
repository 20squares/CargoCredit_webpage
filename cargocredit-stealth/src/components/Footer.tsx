import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 py-16 px-6 border-t border-white/5 backdrop-blur-md bg-background/60">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-8 text-sm text-text/40">
            <a 
              href="mailto:info@cargocredit.io"
              className="hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 rounded"
            >
              info@cargocredit.io
            </a>
            <span>© 2025 CargoCredit</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;