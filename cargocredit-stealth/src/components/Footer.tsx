import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="py-16 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-text/50 mb-8">
            Backed by operators in fintech & supply chains.
          </p>
          
          <div className="flex items-center justify-center gap-8 text-sm text-text/40">
            <a 
              href="mailto:hello@cargocredit.com"
              className="hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 rounded"
            >
              hello@cargocredit.com
            </a>
            <span>© 2024 CargoCredit</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;