import React, { useEffect, useRef, useState } from 'react';

const Education = () => {
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

  const items = [
    {
      date: '2021 - 2023',
      title: 'Web & Mobile App Development',
      institution: 'Saylani Mass IT Training',
      desc: 'Completed professional training in web and mobile app development.'
    },
    {
      date: '2019 - 2021',
      title: 'Intermediate (Pre-Engineering)',
      institution: 'Punjab Board',
      desc: 'Core intermediate education with a focus on pre-engineering.'
    },
    {
      date: '2017 - 2019',
      title: 'Matriculation (Science)',
      institution: 'Punjab Board',
      desc: 'Completed matriculation with distinction in science subjects.'
    }
  ];

  return (
    <section id="education" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Education</h2>
        <div className="education-grid">
          {items.map((item, index) => (
            <div key={index} className={`edu-card fade-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 0.15}s` }}>
              <div className="edu-date">{item.date}</div>
              <h3 className="edu-title">{item.title}</h3>
              <div className="edu-institution">{item.institution}</div>
              <p className="edu-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
