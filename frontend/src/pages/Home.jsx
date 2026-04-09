import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import CanvasBackground from '../components/CanvasBackground';
import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    // Restore original body styles for portfolio
    document.body.style.backgroundColor = '#0a0a14'; // --dark-bg
    document.body.style.color = '#f5f5f7'; // --text-primary
    document.body.className = ''; // Remove any admin classes
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <>
      <CanvasBackground />
      <Header />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
      {/* WhatsApp Floating Icon */}
      <a 
        href="https://wa.me/923181168965?text=Hello%20Abdul%20Ghani!" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-float"
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
      </a>
    </>
  );
};

export default Home;
