import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <a href="#home" className="logo">Abdul<span>Ghani</span></a>
        <div className="footer-text">
          &copy; {currentYear} Abdul Ghani. All Rights Reserved.
        </div>
        <div className="footer-socials">
          <a href="https://github.com/ghanicodes" target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>
          <a href="https://www.linkedin.com/in/abdul-ghani-a645202b9/" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
          <a href="mailto:abdulghaniag1010@gmail.com"><i className="fas fa-envelope"></i></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
