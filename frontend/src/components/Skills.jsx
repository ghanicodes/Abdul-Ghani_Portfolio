import React, { useEffect, useRef, useState } from 'react';

const Skills = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const categories = [
    {
      title: 'Frontend',
      icon: 'fas fa-laptop-code',
      skills: [
        { name: 'HTML5', dot: 'orange' },
        { name: 'CSS3', dot: 'blue' },
        { name: 'JavaScript', dot: 'yellow' },
        { name: 'React', dot: 'cyan' },
      ]
    },
    {
      title: 'Backend',
      icon: 'fas fa-server',
      skills: [
        { name: 'Node.js', dot: 'green' },
        { name: 'Express.js', dot: 'white' },
        { name: 'REST APIs', dot: 'blue' },
        { name: 'JWT', dot: 'purple' },
      ]
    },
    {
      title: 'Database',
      icon: 'fas fa-database',
      skills: [
        { name: 'MongoDB', dot: 'green' },
        { name: 'Mongoose', dot: 'red' },
        { name: 'Firebase', dot: 'yellow' },
      ]
    },
    {
      title: 'E-Commerce',
      icon: 'fas fa-shopping-cart',
      skills: [
        { name: 'Shopify', dot: 'green' },
        { name: 'Liquid', dot: 'blue' },
        { name: 'Shopify API', dot: 'purple' },
      ]
    },
    {
      title: 'Tools',
      icon: 'fas fa-tools',
      skills: [
        { name: 'Git', dot: 'orange' },
        { name: 'GitHub', dot: 'white' },
        { name: 'VS Code', dot: 'blue' },
        { name: 'Postman', dot: 'orange' },
        { name: 'Figma', dot: 'pink' },
      ]
    }
  ];

  return (
    <section id="skills" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Skills & Technologies</h2>
        <div className="skills-grid">
          {categories.map((cat, index) => (
            <div key={index} className={`skill-category fade-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 0.1}s` }}>
              <div className="skill-category-header">
                <i className={`${cat.icon} cat-icon`}></i>
                <h3>{cat.title}</h3>
              </div>
              <div className="skill-list">
                {cat.skills.map((skill, i) => (
                  <div key={i} className="skill-item">
                    <div className={`skill-dot ${skill.dot}`}></div>
                    <span className="skill-name">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
