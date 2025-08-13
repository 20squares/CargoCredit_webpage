import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GraphCanvas from './GraphCanvas';
import EmailForm from './EmailForm';

const Hero: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Sticky full-page graph background */}
      <div className="fixed inset-0 z-0">
        <GraphCanvas />
      </div>
      
      {/* Hero content with transparent background */}
      <section className="relative z-10 min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-text to-text/80 bg-clip-text text-shadow-lg">
              Liquidity for your whole supply chain.
            </h2>
            
            <p className="text-lg md:text-xl text-text/70 mb-8 max-w-2xl mx-auto backdrop-blur-sm bg-background/40 rounded-lg p-4">
              We're building programmable finance rails that move with supplier–buyer relationships.
            </p>
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