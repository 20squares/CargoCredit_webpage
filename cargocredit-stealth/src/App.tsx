import Header from './components/Header';
import Hero from './components/Hero';
import ValueProps from './components/ValueProps';
import Footer from './components/Footer';
import GraphCanvas from './components/GraphCanvas';

function App() {
  return (
    <div className="min-h-screen bg-background text-text relative">
      {/* Fixed graph background for entire page */}
      <div className="fixed inset-0 z-0">
        <GraphCanvas />
      </div>

      <Header />
      <main>
        <Hero />
        <ValueProps />
      </main>
      <Footer />
    </div>
  );
}

export default App
