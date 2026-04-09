import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-bg"></div>
      <div className="container">
        <div className="hero-content">
          <p className="hero-subtitle">Hello, I'm</p>
          <h1 className="hero-title">Abdul Ghani</h1>
          <h2 className="hero-subtitle">Backend Developer Intern & Full-Stack Enthusiast</h2>
          <p className="hero-description">
            I engineer robust backend architectures, scalable REST APIs, and dynamic web
            applications using Node.js, Express.js, MongoDB, and React.js. Passionate about writing optimized,
            secure, and production-ready code.
          </p>
          <div className="hero-btns">
            <a href="#contact" className="btn">Hire Me</a>
            <a href="/Abdul Ghani CV.pdf" download className="btn btn-outline">
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
