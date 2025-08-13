import React from 'react';
import { motion } from 'framer-motion';
import { Network, Zap, Users } from 'lucide-react';

const ValueProps: React.FC = () => {
  const props = [
    {
      icon: Network,
      title: 'Network-aware financing',
      description: 'Pricing and limits that reflect real supplier–buyer ties.',
    },
    {
      icon: Zap,
      title: 'Programmable settlement',
      description: 'Rules, not emails, move working capital.',
    },
    {
      icon: Users,
      title: 'End-to-end simplicity',
      description: 'Finance that plugs into existing ops.',
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {props.map((prop, index) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors">
                <div className="mb-4">
                  <prop.icon className="w-8 h-8 text-accent/80" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{prop.title}</h3>
                <p className="text-text/60 leading-relaxed">{prop.description}</p>
              </div>
              
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;