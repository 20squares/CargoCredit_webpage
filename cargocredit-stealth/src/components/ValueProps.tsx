import React from 'react';
import { motion } from 'framer-motion';
import { Network, Zap, Shield, Workflow, TrendingUp, Leaf } from 'lucide-react';

const ValueProps: React.FC = () => {
  const props = [
    {
      icon: Network,
      title: 'Deep-tier visibility',
      description: 'Finance that reaches 5+ tiers deep—from OEM buyers to raw material suppliers.',
      color: 'text-blue-400'
    },
    {
      icon: Workflow,
      title: 'Smart contract triggers',
      description: 'Automated payment issuance based on delivery, quality, and compliance verification.',
      color: 'text-purple-400'
    },
    {
      icon: Leaf,
      title: 'Verification-linked payments',
      description: 'Event data flows upstream (delivery, quality, ESG, etc.) triggering programmable milestones.',
      color: 'text-green-400'
    },
    {
      icon: Zap,
      title: 'Milestone financing',
      description: 'Split payments based on real events: 50% delivery, 30% quality, 20% compliance.',
      color: 'text-amber-400'
    },
    {
      icon: TrendingUp,
      title: 'Automated routing',
      description: 'Payment instruments split and route automatically based on invoice breakdown.',
      color: 'text-accent'
    },
    {
      icon: Shield,
      title: 'Buyer credit for all',
      description: 'Every tier accesses the OEM\'s credit strength, not just Tier-1.',
      color: 'text-cyan-400'
    },
  ];

  return (
    <section className="relative z-10 py-48 px-6 backdrop-blur-md bg-background/70 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-text to-accent bg-clip-text text-transparent">
            Programmable supply chain finance
          </h3>
          <p className="text-text/60 max-w-2xl mx-auto text-lg">
            Rules, not emails. Real-time verification, automated splits, and deep-tier liquidity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {props.map((prop, index) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="group relative"
            >
              <div className="h-full p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-white/10 transition-all">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <prop.icon className={`w-6 h-6 ${prop.color}`} strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-3 text-text">{prop.title}</h3>
                <p className="text-text/60 leading-relaxed text-sm">{prop.description}</p>
              </div>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Additional info section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 p-8 bg-gradient-to-r from-accent/5 to-purple-500/5 border border-accent/20 rounded-2xl"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h4 className="text-xl font-bold mb-3 text-text">How it works</h4>
            <p className="text-text/70 leading-relaxed">
              Purchase orders cascade down your supply chain. Goods and verification data flow back up—delivery
              confirmations, quality inspections, compliance certifications (ESG, safety, etc.). When all conditions
              are met, smart contracts automatically issue payment instruments. These split based on your invoice
              breakdown and route to the right suppliers. Everyone gets paid from the buyer's credit. No delays,
              no paperwork.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProps;
