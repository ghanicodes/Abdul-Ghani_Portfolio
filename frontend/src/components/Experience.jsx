import React, { useEffect, useRef, useState } from 'react';

const Experience = () => {
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
      date: '2024 - Present',
      role: 'Full Stack Developer',
      company: 'TechCurve Solutions',
      desc: [
        'Developing creative web applications using MERN stack and modern tools.',
        'Building RESTful APIs, integrating third-party services and payment gateways.',
        'Optimizing application performance and improving user experience.',
      ]
    },
    {
      date: '2018 - 2024',
      role: 'Frontend Developer',
      company: 'TechCurve Solutions',
      desc: [
        'Built responsive and interactive user interfaces using React and Tailwind CSS.',
        'Collaborated with backend teams to integrate APIs and manage client-side logic.',
        'Enhanced application usability and performance across devices.',
      ]
    },
    {
      date: '2023',
      role: 'MERN Stack Developer Intern',
      company: 'TechCurve Solutions',
      desc: [
        'Worked on real-world projects using MongoDB, Express.js, React and Node.js.',
        'Implemented authentication, CRUD operations and API integrations.',
        'Gained hands-on experience in full-stack development and best practices.',
      ]
    }
  ];

  return (
    <section id="experience" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Experience</h2>
        <p className="section-subtitle" style={{ textAlign: 'center' }}></p>
        <div className="timeline">
          {items.map((item, index) => (
            <div key={index} className={`timeline-item fade-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 0.15}s` }}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-role">{item.role}</h3>
                    <div className="timeline-company">{item.company}</div>
                  </div>
                  <div className="timeline-date">{item.date}</div>
                </div>
                <ul className="timeline-desc">
                  {item.desc.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
