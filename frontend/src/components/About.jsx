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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef}>
      <div className="container">
        <div className={`about-grid fade-up ${isVisible ? 'visible' : ''}`}>
          <div className="about-text">
            <h2 className="section-title">About Me</h2>
            <p>
              I'm a passionate Full Stack Developer with a strong foundation in building scalable
              web applications using the MERN stack and modern technologies. I enjoy turning
              ideas into real-world products with clean code and great user experiences.
            </p>
            <p>
              I'm constantly learning, improving and exploring new tech to build solutions
              that are efficient, secure and impactful.
            </p>
          </div>
          <div className="about-cards">
            <div className="info-card">
              <div className="info-icon"><i className="fas fa-map-marker-alt"></i></div>
              <div>
                <div className="info-label">Location</div>
                <div className="info-value">Karachi, Pakistan</div>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon"><i className="fas fa-calendar-alt"></i></div>
              <div>
                <div className="info-label">Experience</div>
                <div className="info-value">2+ Years</div>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon"><i className="fas fa-code"></i></div>
              <div>
                <div className="info-label">Specialization</div>
                <div className="info-value">Full Stack Development</div>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon"><i className="fas fa-rocket"></i></div>
              <div>
                <div className="info-label">Current Focus</div>
                <div className="info-value">Scalable Web Apps</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
