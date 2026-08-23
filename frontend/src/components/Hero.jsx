import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">Available For Opportunities</div>
          <h1 className="hero-title">
            Hi, I'm Abdul Ghani<br />
            <span className="highlight">Full Stack Developer.</span>
          </h1>
          <p className="hero-description">
            I build modern, high-performance web experiences with clean code,
            thoughtful UI and scalable technologies.
          </p>
          <div className="hero-tech">
            <span>MERN Stack</span>
            <span>React</span>
            <span>Node.js</span>
            <span>JavaScript</span>
            <span>Shopify</span>
          </div>
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">View My Work <i className="fas fa-arrow-right"></i></a>
            <a href="/Abdul Ghani CV.pdf" download className="btn btn-outline">Download CV <i className="fas fa-download"></i></a>
          </div>
          <div className="hero-socials">
            <a href="https://github.com/ghanicodes" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i> GitHub</a>
            <a href="https://www.linkedin.com/in/abdul-ghani-a645202b9/" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i> LinkedIn</a>
            <a href="mailto:abdulghaniag1010@gmail.com"><i className="fas fa-envelope"></i> Email</a>
          </div>
        </div>

        <div className="hero-graphic">
          <div className="code-window">
            <div className="code-header">
              <div className="code-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
            <div className="code-body">
              <span className="code-keyword">const</span> <span className="code-const">developer</span> = {'{'}<br />
              &nbsp;&nbsp;<span className="code-property">name:</span> <span className="code-string">'Abdul Ghani'</span>,<br />
              &nbsp;&nbsp;<span className="code-property">role:</span> <span className="code-string">'Full Stack Developer'</span>,<br />
              &nbsp;&nbsp;<span className="code-property">skills:</span> [<span className="code-string">'React'</span>, <span className="code-string">'Node.js'</span>, <span className="code-string">'MongoDB'</span>],<br />
              &nbsp;&nbsp;<span className="code-property">passion:</span> <span className="code-string">'Building scalable web solutions'</span>,<br />
              &nbsp;&nbsp;<span className="code-property">focus:</span> <span className="code-string">'Clean code, performance, UX'</span><br />
              {'}'};<br />
              <br />
              <span className="code-keyword">function</span> <span className="code-const">createImpact</span>() {'{'}<br />
              &nbsp;&nbsp;<span className="code-keyword">return</span> <span className="code-string">'Solutions that make a difference'</span>;<br />
              {'}'}
            </div>
          </div>
          <div className="experience-badge">
            <h3>2+</h3>
            <p>Years of<br />Experience</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
