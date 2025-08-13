import React from 'react';
import { motion } from 'framer-motion';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Connect Your Network',
      description: 'Map your existing supplier-buyer relationships and payment terms.',
    },
    {
      step: '02',
      title: 'Dynamic Risk Assessment',
      description: 'Our algorithms analyze network topology to price liquidity optimally.',
    },
    {
      step: '03',
      title: 'Automated Execution',
      description: 'Smart contracts execute payments based on predefined network rules.',
    },
    {
      step: '04',
      title: 'Scale Across Tiers',
      description: 'Extend financing deep into your supply chain with network effects.',
    },
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Network Finance Works
          </h2>
          <p className="text-text/60 text-lg max-w-2xl mx-auto">
            Watch how liquidity flows through your supply chain network as you scroll.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-accent/10 border border-accent/30 rounded-lg flex items-center justify-center">
                  <span className="text-accent font-mono text-sm">{step.step}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-text/60 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;