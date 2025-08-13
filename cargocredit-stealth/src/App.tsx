import Header from './components/Header';
import Hero from './components/Hero';
import ValueProps from './components/ValueProps';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background text-text relative">
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
