import { useEffect, useState } from 'react';

const EMAIL_USER = 'info';
const EMAIL_DOMAIN = 'cargocredit.io';

function ContactEmail() {
  const [address, setAddress] = useState('');

  useEffect(() => {
    setAddress(`${EMAIL_USER}@${EMAIL_DOMAIN}`);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = `mailto:${EMAIL_USER}@${EMAIL_DOMAIN}`;
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      aria-label={`Email ${EMAIL_USER} at ${EMAIL_DOMAIN}`}
      className="text-muted hover:text-text transition-colors duration-300 underline decoration-subtle decoration-1 underline-offset-4 hover:decoration-muted"
    >
      {address || `${EMAIL_USER} [at] ${EMAIL_DOMAIN}`}
    </a>
  );
}

function App() {
  return (
    <main className="min-h-screen bg-background text-text flex flex-col items-center justify-between px-6 py-10 sm:py-14">
      <header className="w-full flex justify-center sm:justify-start">
        <div
          className="fade-rise font-sans text-sm tracking-[0.18em] uppercase text-text/90"
          style={{ animationDelay: '60ms' }}
        >
          CargoCredit
        </div>
      </header>

      <section className="flex flex-col items-center text-center max-w-3xl">
        <div
          className="fade-rise h-px w-10 bg-subtle mb-10"
          style={{ animationDelay: '240ms' }}
          aria-hidden="true"
        />

        <h1 className="font-serif leading-[1.05] tracking-tight text-text/95">
          <span
            className="fade-rise block italic text-4xl sm:text-5xl md:text-6xl text-muted"
            style={{ animationDelay: '360ms' }}
          >
            A centuries-old instrument.
          </span>
          <span
            className="fade-rise block text-4xl sm:text-5xl md:text-6xl mt-2"
            style={{ animationDelay: '560ms' }}
          >
            A brand-new asset class.
          </span>
        </h1>

        <div
          className="fade-rise mt-10 h-px w-10 bg-subtle"
          style={{ animationDelay: '760ms' }}
          aria-hidden="true"
        />
      </section>

      <footer
        className="fade-rise w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans text-muted"
        style={{ animationDelay: '900ms' }}
      >
        <span className="tracking-[0.14em] uppercase text-muted/80">
          In stealth · 2026
        </span>
        <ContactEmail />
      </footer>
    </main>
  );
}

export default App;
