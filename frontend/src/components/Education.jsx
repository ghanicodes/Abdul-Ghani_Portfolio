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
  date: '2023 - 2024',
  title: 'Web & Mobile App Development',
  institution: 'Saylani Mass IT Training (SMIT)',
  desc: 'Professional training in web and mobile app development, covering modern technologies and practical project development.'
},
{
  date: '2021 - 2023',
  title: 'Intermediate (Computer Science)',
  institution: 'Govt. Superior College',
  desc: 'Completed intermediate education with a focus on computer science and foundational technical concepts.'
},
{
  date: '2021',
  title: 'Matriculation (Science)',
  institution: 'Pacific Grammar School',
  desc: 'Completed secondary education with a focus on science subjects.'
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
