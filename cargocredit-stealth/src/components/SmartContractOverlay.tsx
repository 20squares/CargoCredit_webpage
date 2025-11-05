import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Code2 } from 'lucide-react';

interface SmartContractCondition {
  condition: string;
  met: boolean;
  progress: number;
}

interface SmartContractOverlayProps {
  conditions?: SmartContractCondition[];
  visible: boolean;
}

const conditionLabels: Record<string, string> = {
  delivery_confirmed: 'Delivery Confirmed',
  quality_passed: 'Quality Inspection Passed',
  esg_verified: 'Compliance Verified'
};

const SmartContractOverlay: React.FC<SmartContractOverlayProps> = ({ conditions, visible }) => {
  if (!visible || !conditions) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="fixed right-8 top-32 z-30 pointer-events-none"
      >
        <div className="bg-background/95 backdrop-blur-md border border-accent/30 rounded-xl p-5 shadow-2xl max-w-sm">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-bold text-text">Smart Contract Verification</h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="text-text/70 mb-3">
              <code className="text-accent/80">IF</code> (
            </div>

            {conditions.map((cond, idx) => (
              <motion.div
                key={cond.condition}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-3 pl-4">
                  {cond.met ? (
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-text/30 flex-shrink-0" />
                  )}
                  <span className={cond.met ? 'text-accent' : 'text-text/60'}>
                    {conditionLabels[cond.condition] || cond.condition}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="ml-11 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${cond.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {idx < conditions.length - 1 && (
                  <div className="pl-4 text-text/50">
                    <code className="text-accent/60">&&</code>
                  </div>
                )}
              </motion.div>
            ))}

            <div className="text-text/70 mt-3">
              )
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: conditions.every(c => c.met) ? 1 : 0.3 }}
              className="mt-4 pt-4 border-t border-white/10"
            >
              <div className="text-text/70">
                <code className="text-accent/80">THEN</code>{' '}
                <span className={conditions.every(c => c.met) ? 'text-accent' : 'text-text/50'}>
                  issue_payment($2.0M)
                </span>
              </div>
            </motion.div>

            {conditions.every(c => c.met) && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-3 p-3 bg-accent/10 border border-accent/30 rounded-lg"
              >
                <div className="text-accent text-xs font-bold">
                  ✓ All conditions met
                </div>
                <div className="text-text/70 text-xs mt-1">
                  Executing payment issuance...
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SmartContractOverlay;
