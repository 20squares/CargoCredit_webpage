import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EmailForm from './EmailForm';
import SmartContractOverlay from './SmartContractOverlay';
import BoESplitOverlay from './BoESplitOverlay';
import { getScrollBasedFlow, generateGraph } from '../lib/graph';

const Hero: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [graph] = useState(() => generateGraph());

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = Math.min(1, Math.max(0, scrollY / scrollableHeight));
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const flowState = getScrollBasedFlow(graph, scrollProgress);

  // Show smart contract overlay during verification stage (0.4-0.6)
  const showSmartContract = scrollProgress >= 0.4 && scrollProgress < 0.6;

  // Show BoE split overlay during BoE stage (0.6-0.8)
  const showBoESplit = scrollProgress >= 0.6 && scrollProgress < 0.8;
  const boeSplitProgress = showBoESplit ? (scrollProgress - 0.6) / 0.2 : 0;

  return (
    <>
      {/* Smart Contract Overlay */}
      <SmartContractOverlay
        conditions={flowState.smartContractConditions}
        visible={showSmartContract}
      />

      {/* BoE Split Overlay */}
      {graph.boeSplits && graph.boeSplits.length > 0 && (
        <BoESplitOverlay
          visible={showBoESplit}
          fromAmount={graph.boeSplits[0].fromAmount}
          splits={graph.boeSplits[0].splits}
          progress={boeSplitProgress}
        />
      )}

      {/* Hero content with transparent background */}
      <section className="relative z-10 min-h-[150vh] flex items-center justify-center pt-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-text via-text to-accent/90 bg-clip-text text-transparent text-shadow-lg">
              Deep-tier liquidity.
              <br />
              Programmable finance.
            </h2>

            <p className="text-lg md:text-xl text-text/70 mb-8 max-w-2xl mx-auto backdrop-blur-sm bg-background/40 rounded-lg p-6 leading-relaxed">
              We're building finance rails that move with your supply chain—from OEM to raw materials.
              <br />
              <span className="text-accent/90 font-medium mt-2 block">
                Triggered by real events: delivery, quality, compliance.
              </span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-text/60 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                Smart Contract Triggers
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Event-Based Payments
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                Automated Routing
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-sm text-text/50 italic"
            >
              Scroll to explore the journey →
            </motion.p>
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
