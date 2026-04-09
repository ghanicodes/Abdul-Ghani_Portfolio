import React, { useEffect, useRef, useState } from 'react';

const Projects = () => {
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

  const projects = [
    {
      title: 'Bootcamp Tracker – Full-Stack LMS',
      img: '/images/bootcamp-tracker.png',
      desc: 'A scalable full-stack SPA for student progress tracking. Includes secure JWT authentication, role-based dashboards (Admin, Teacher, Student), and modules for assignments and attendance.',
      tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
      live: '#',
      github: 'https://github.com/ghanicodes'
    },
    {
      title: 'Social Vibes – Real-Time Social Media Platform',
      img: '/images/SocialVibes.jpg',
      desc: 'Social Vibes – A full-stack Instagram-like social media app with authentication, real-time posts, likes, comments, sharing, and image uploads powered by Supabase.',
      tags: ['HTML', 'CSS', 'JavaScript', 'SupaBase'],
      live: 'https://thesocialvibes.netlify.app/',
      github: 'https://github.com/ghanicodes'
    },
    {
      title: 'OLX Clone Admin Panel',
      img: '/images/olx-imge.jpg',
      desc: 'OLX Clone with Admin Panel – A real-world marketplace application where authenticated users can post items for sale, purchase products, and manage listings through an integrated admin dashboard.',
      tags: ['HTML', 'CSS', 'JavaScript', 'SupaBase'],
      live: 'https://olx-clone-e-commerce.netlify.app/',
      github: 'https://github.com/ghanicodes'
    }
  ];

  return (
    <section id="projects" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">My Projects</h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className={`project-card ${isVisible ? 'visible' : ''}`}>
              <div className="project-img">
                <img src={project.img} alt={project.title} />
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.desc}</p>
                <div className="project-tags">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="project-tag">{tag}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.live} className="project-link">
                    <i className="fas fa-external-link-alt"></i> Live Demo
                  </a>
                  <a href={project.github} className="project-link">
                    <i className="fab fa-github"></i> GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
