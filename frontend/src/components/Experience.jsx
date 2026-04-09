import React, { useEffect, useRef, useState } from 'react';

const Experience = () => {
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

  const timelineItems = [
    {
      date: '2026 - Present',
      title: 'Backend Developer Intern',
      desc: 'Building scalable REST APIs, designing working database structures with MongoDB, and actively debugging and optimizing backend logic for robust application performance.'
    },
    {
      date: '2024',
      title: 'Web & Mobile App Development Certification (SMIT)',
      desc: 'Successfully completed a comprehensive full-stack training program at SMIT, gaining robust hands-on expertise in the MERN development stack.'
    },
    {
      date: '2023',
      title: 'Intermediate in Computer Science',
      desc: 'Acquired a strong foundation in Computer Science principles, algorithmic thinking, and fundamental programming concepts at Govt. Superior College.'
    }
  ];

  return (
    <section id="experience" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Experience & Education</h2>
        <div className="timeline">
          {timelineItems.map((item, index) => (
            <div key={index} className={`timeline-item ${isVisible ? 'visible' : ''}`}>
              <div className="timeline-content">
                <div className="timeline-date">{item.date}</div>
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
