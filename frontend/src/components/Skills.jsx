import React, { useEffect, useRef, useState } from 'react';

const Skills = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const skillsData = [
    { title: 'Node.js & Express.js (Backend)', icon: 'fas fa-server', width: '85%' },
    { title: 'MongoDB (Database)', icon: 'fas fa-database', width: '80%' },
    { title: 'REST APIs & Architecture', icon: 'fas fa-network-wired', width: '85%' },
    { title: 'React.js (Frontend)', icon: 'fab fa-react', width: '80%' },
    { title: 'JavaScript (ES6+)', icon: 'fab fa-js', width: '85%' },
    { title: 'HTML5 / CSS3', icon: 'fab fa-html5', width: '90%' },
  ];

  return (
    <section id="skills" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">My Skills</h2>
        <div className="skills-container">
          {skillsData.map((skill, index) => (
            <div key={index} className={`skill-item ${isVisible ? 'visible' : ''}`}>
              <div className="skill-header">
                <i className={`${skill.icon} skill-icon`}></i>
                <h3 className="skill-title">{skill.title}</h3>
              </div>
              <div className="skill-bar">
                <div 
                  className="skill-progress" 
                  style={{ width: isVisible ? skill.width : '0%' }}
                >
                  <span className="skill-percent">{isVisible ? skill.width : '0%'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
