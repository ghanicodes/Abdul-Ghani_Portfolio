import React, { useEffect, useRef, useState } from 'react';

const About = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className={`about-img ${isVisible ? 'visible' : ''}`}>
            <img src="/images/developer-portfolio.jpg" alt="Abdul Ghani" />
          </div>
          <div className={`about-text ${isVisible ? 'visible' : ''}`}>
            <h3>Backend Developer Intern & Full-Stack Enthusiast</h3>
            <p>
              Hello! I'm Abdul Ghani, a focused Backend Developer Intern with strong expertise in building
              scalable REST APIs and server-side logic using Node.js, Express.js, and MongoDB. I also possess
              solid full-stack skills with hands-on experience in React.js and modern frontend technologies.
            </p>
            <p>
              I thrive on solving complex backend problems, optimizing databases, and designing robust system
              architectures. Having built multiple real-world projects such as an OLX Clone, a Social Media
              App, and a College Portal, I bring practical industry experience to the table.
            </p>
            <p>
              I am passionate about exploring emerging technologies and actively building production-ready
              applications to elevate my backend and full-stack capabilities.
            </p>
            <div className="skills-summary">
              <div className="skill-tag">Node.js</div>
              <div className="skill-tag">Express.js</div>
              <div className="skill-tag">MongoDB</div>
              <div className="skill-tag">REST APIs</div>
              <div className="skill-tag">React.js</div>
              <div className="skill-tag">JavaScript</div>
              <div className="skill-tag">HTML/CSS</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
