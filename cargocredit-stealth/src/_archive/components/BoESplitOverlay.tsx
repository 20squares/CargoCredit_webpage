import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Split } from 'lucide-react';

interface BoESplit {
  amount: number;
  toNode: string;
  label: string;
}

interface BoESplitOverlayProps {
  visible: boolean;
  fromAmount: number;
  splits: BoESplit[];
  progress: number; // 0-1
}

const formatAmount = (amount: number) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
};

const nodeLabels: Record<string, string> = {
  'tier2-electronics': 'Electronics Mfg',
  'tier2-mechanical': 'Mechanical Parts',
  'tier2-packaging': 'Packaging',
  'tier3-assembler': 'Assembly Plant'
};

const BoESplitOverlay: React.FC<BoESplitOverlayProps> = ({
  visible,
  fromAmount,
  splits,
  progress
}) => {
  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed left-8 bottom-32 z-30 pointer-events-none"
      >
        <div className="bg-background/95 backdrop-blur-md border border-amber-500/30 rounded-xl p-5 shadow-2xl max-w-md">
          <div className="flex items-center gap-2 mb-4">
            <Split className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-text">Automated Payment Routing</h3>
          </div>

          <div className="space-y-3">
            {/* Source */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg"
            >
              <div className="flex-1">
                <div className="text-xs text-text/60 mb-1">Payment Instrument Issued</div>
                <div className="text-lg font-bold text-amber-500">{formatAmount(fromAmount)}</div>
              </div>
            </motion.div>

            {/* Arrow */}
            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Split className="w-6 h-6 text-amber-500/50" />
              </motion.div>
            </div>

            {/* Splits */}
            <div className="space-y-2">
              {splits.map((split, idx) => {
                const splitProgress = Math.max(0, Math.min(1, (progress - idx * 0.15) / 0.7));

                return (
                  <motion.div
                    key={split.toNode}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: splitProgress > 0 ? 1 : 0.3,
                      x: 0
                    }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <ArrowRight
                        className={`w-4 h-4 flex-shrink-0 ${
                          splitProgress > 0.5 ? 'text-accent' : 'text-text/30'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-text/60 truncate">
                          {nodeLabels[split.toNode] || split.toNode}
                        </div>
                        <div className="text-xs font-mono text-text/80">{split.label}</div>
                      </div>
                    </div>

                    <div
                      className={`text-sm font-bold ${
                        splitProgress > 0.5 ? 'text-accent' : 'text-text/40'
                      }`}
                    >
                      {formatAmount(split.amount)}
                    </div>

                    {/* Progress indicator */}
                    {splitProgress > 0 && splitProgress < 1 && (
                      <motion.div
                        className="absolute inset-0 bg-accent/5 rounded-lg"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: splitProgress }}
                        style={{ transformOrigin: 'left' }}
                      />
                    )}

                    {splitProgress >= 1 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -right-1 -top-1"
                      >
                        <div className="w-3 h-3 bg-accent rounded-full border-2 border-background" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-text/60">
              <div className="flex items-center justify-between">
                <span>Total Routed:</span>
                <span className="font-mono text-accent">
                  {formatAmount(splits.reduce((sum, s) => sum + s.amount, 0))}
                </span>
              </div>
              <div className="mt-2 text-text/40 text-[10px]">
                Automated routing based on invoice breakdown
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BoESplitOverlay;
