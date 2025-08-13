import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GraphCanvas from './GraphCanvas';
import EmailForm from './EmailForm';

const Hero: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <GraphCanvas />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-text to-text/80 bg-clip-text">
              Liquidity that flows with your supply chain.
            </h2>
            
            <p className="text-lg md:text-xl text-text/70 mb-8 max-w-2xl mx-auto">
              We're building programmable finance rails that move with supplier–buyer relationships.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-accent/20 hover:bg-accent/30 border border-accent/50 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent/50"
              aria-label="Request early access"
            >
              Request early access
            </motion.button>
          </motion.div>
        </div>
      </section>
      
      {showModal && (
        <EmailForm onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default Hero;