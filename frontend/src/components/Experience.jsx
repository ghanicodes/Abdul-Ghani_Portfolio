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
      date: 'April 2026 – Present',
      role: 'MERN Stack & Shopify Developer',
      company: 'TechCure',
      desc: [
        'Develop full-stack web applications using the MERN Stack (MongoDB, Express.js, React.js, Node.js).',
        'Build RESTful APIs and customize Shopify stores, themes, and features.',
        'Collaborate with cross-functional teams to deliver production-ready solutions.',
        'Optimize performance while following clean code, Git workflows, and best practices.'
      ]
    },
    // {
    //   date: '2018 - 2024',
    //   role: 'Frontend Developer',
    //   company: 'TechCurve Solutions',
    //   desc: [
    //     'Built responsive and interactive user interfaces using React and Tailwind CSS.',
    //     'Collaborated with backend teams to integrate APIs and manage client-side logic.',
    //     'Enhanced application usability and performance across devices.',
    //   ]
    // },
    {
      date: 'Feb 2026 – Apr 2026',
      role: 'Backend Developer Intern',
      company: 'Saylani Mass IT Training (SMIT)',
      desc: [
        'Developed a real-world Bootcamp Tracker LMS with scalable backend architecture.',
        'Built RESTful APIs with authentication and role-based authorization (Admin, Teacher, Student).',
        'Developed core modules including attendance, assignments, and bootcamp management.',
        'Designed MongoDB databases and integrated APIs with frontend applications following best practices.',
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
