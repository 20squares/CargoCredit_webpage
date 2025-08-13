import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';

interface EmailFormProps {
  onClose: () => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Trap focus
    firstFocusRef.current?.focus();
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: typeof errors = {};
    
    if (!email || !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!consent) {
      newErrors.consent = 'Please agree to be contacted';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Mock API call
    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message, consent }),
      }).catch(() => {
        // Mock successful response even if endpoint doesn't exist
        console.log('Early access request:', { email, message, consent });
        return { ok: true };
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => onClose(), 2000);
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-background border border-white/10 rounded-2xl p-6"
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text/60 hover:text-text transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-lg"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
        
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 id="modal-title" className="text-2xl font-semibold mb-2">Request early access</h3>
              <p id="modal-description" className="text-text/60 mb-6">
                Network-aware financing for modern procurement. Currently in stealth.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email address
                  </label>
                  <input
                    ref={firstFocusRef}
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({ ...errors, email: undefined });
                    }}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-colors"
                    placeholder="you@company.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>
                
                <div>
                  <button
                    type="button"
                    onClick={() => setShowMessage(!showMessage)}
                    className="text-sm text-accent/80 hover:text-accent transition-colors"
                  >
                    How can we help? (optional)
                  </button>
                  
                  <AnimatePresence>
                    {showMessage && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full mt-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-colors resize-none"
                          rows={3}
                          placeholder="Tell us about your use case..."
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        setErrors({ ...errors, consent: undefined });
                      }}
                      className="mt-1 w-4 h-4 bg-white/5 border border-white/20 rounded focus:ring-2 focus:ring-accent/50"
                      aria-invalid={!!errors.consent}
                      aria-describedby={errors.consent ? 'consent-error' : undefined}
                    />
                    <span className="text-sm text-text/70">
                      By submitting, you agree to be contacted about CargoCredit updates.
                    </span>
                  </label>
                  {errors.consent && (
                    <p id="consent-error" className="mt-1 text-sm text-red-400">
                      {errors.consent}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-accent/20 hover:bg-accent/30 border border-accent/50 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  Submit
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Thanks — we'll be in touch.</h3>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default EmailForm;