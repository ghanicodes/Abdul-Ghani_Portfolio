import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Abdul Ghani. All Rights Reserved. |{' '}
          <Link to="/admin" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.5 }}>
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
