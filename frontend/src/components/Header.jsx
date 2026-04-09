import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header id="header" className={isScrolled ? 'scrolled' : ''}>
      <div className="container nav-container">
        <a href="#" className="logo">Abdul<span>Ghani</span></a>
        <div className="menu-btn" onClick={toggleMenu}>
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </div>
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#home" onClick={closeMenu}>Home</a></li>
          <li><a href="#about" onClick={closeMenu}>About</a></li>
          <li><a href="#skills" onClick={closeMenu}>Skills</a></li>
          <li><a href="#projects" onClick={closeMenu}>Projects</a></li>
          <li><a href="#experience" onClick={closeMenu}>Experience</a></li>
          <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
