import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EmailForm from './EmailForm';

const Header: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <h1 className="text-2xl font-bold tracking-tight">CargoCredit</h1>
              <span className="px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full border border-accent/20">
                In stealth
              </span>
            </motion.div>
            
          </div>
        </div>
      </header>
      
      {showModal && (
        <EmailForm onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default Header;