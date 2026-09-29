import React, { useEffect, useRef, useState } from 'react';

const Projects = () => {
  const mernRef = useRef(null);
  const shopifyRef = useRef(null);
  
  const [isMernVisible, setIsMernVisible] = useState(false);
  const [isShopifyVisible, setIsShopifyVisible] = useState(false);

  const [mernProjects, setMernProjects] = useState([]);
  const [shopifyProjects, setShopifyProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isMernExpanded, setIsMernExpanded] = useState(false);
  const [isShopifyExpanded, setIsShopifyExpanded] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Static fallback data in case backend is loading or unreachable
  const defaultMernProjects = [
    {
      _id: 'default-m1',
      title: 'Bootcamp Tracker – Full-Stack LMS',
      img: '/images/bootcamp-tracker.png',
      desc: 'A scalable full-stack SPA for student progress tracking. Includes secure JWT authentication, role-based dashboards (Admin, Teacher, Student), and modules for assignments and attendance.',
      tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
      live: 'https://boot-camp-tracker.vercel.app',
      github: 'https://github.com/ghanicodes',
      category: 'mern'
    },
    {
      _id: 'default-m2',
      title: 'Social Vibes – Real-Time Social Media',
      img: '/images/SocialVibes.jpg',
      desc: 'A full-stack Instagram-like social media app with authentication, real-time posts, likes, comments, sharing, and image uploads powered by Supabase.',
      tags: ['HTML', 'CSS', 'JavaScript', 'SupaBase'],
      live: 'https://thesocialvibes.netlify.app/',
      github: 'https://github.com/ghanicodes',
      category: 'mern'
    },
    {
      _id: 'default-m3',
      title: 'OLX Clone Admin Panel',
      img: '/images/olx-imge.jpg',
      desc: 'A real-world marketplace application where authenticated users can post items for sale, purchase products, and manage listings through an integrated admin dashboard.',
      tags: ['HTML', 'CSS', 'JavaScript', 'SupaBase'],
      live: 'https://olx-clone-e-commerce.netlify.app/',
      github: 'https://github.com/ghanicodes',
      category: 'mern'
    }
  ];

  const defaultShopifyProjects = [
    {
      _id: 'default-s1',
      title: 'CAMÓRE Jewelry',
      img: '/images/shopify-store-1.jpg',
      desc: 'A high-end luxury fashion and jewelry Shopify store featuring custom Liquid section architecture, dynamic AJAX cart drawer, size selector popup, and optimized checkout flow.',
      tags: ['Shopify', 'Liquid', 'JavaScript', 'CSS3', 'Shopify Pay'],
      live: 'https://aurelialuxe-demo.myshopify.com',
      github: 'https://github.com/ghanicodes',
      category: 'shopify'
    },
    {
      _id: 'default-s2',
      title: 'Prieur USA',
      img: '/images/shopify-store-2.jpg',
      desc: 'A modern skincare and beauty Shopify store with custom product filtering, shade finder quiz integration, subscription options, and hyper-responsive UI.',
      tags: ['Shopify Plus', 'Liquid', 'HTML5', 'Sass', 'Klaviyo'],
      live: 'https://glowandco-demo.myshopify.com',
      github: 'https://github.com/ghanicodes',
      category: 'shopify'
    },
    {
      _id: 'default-s3',
      title: 'Springwell Publishing',
      img: '/images/shopify-store-3.jpg',
      desc: 'An immersive digital publishing and store platform built on Shopify. Includes dynamic product variant comparison, custom badges, and high conversion rate optimization.',
      tags: ['Shopify', 'Liquid', 'Tailwind', 'JavaScript', 'REST API'],
      live: 'https://voltgaming-demo.myshopify.com',
      github: 'https://github.com/ghanicodes',
      category: 'shopify'
    }
  ];

  useEffect(() => {
    fetchProjects();

    // Intersection observers for animation
    const mernObserver = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsMernVisible(true); },
      { threshold: 0.1 }
    );
    if (mernRef.current) mernObserver.observe(mernRef.current);

    const shopifyObserver = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsShopifyVisible(true); },
      { threshold: 0.1 }
    );
    if (shopifyRef.current) shopifyObserver.observe(shopifyRef.current);

    return () => {
      mernObserver.disconnect();
      shopifyObserver.disconnect();
    };
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/projects`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();

      const mern = data.filter(p => p.category?.toLowerCase() === 'mern');
      const shopify = data.filter(p => p.category?.toLowerCase() === 'shopify');

      setMernProjects(mern.length > 0 ? mern : defaultMernProjects);
      setShopifyProjects(shopify.length > 0 ? shopify : defaultShopifyProjects);
    } catch (err) {
      console.warn('Backend fetch fallback to static projects:', err);
      setMernProjects(defaultMernProjects);
      setShopifyProjects(defaultShopifyProjects);
    } finally {
      setLoading(false);
    }
  };

  const displayedMernProjects = isMernExpanded ? mernProjects : mernProjects.slice(0, 3);
  const displayedShopifyProjects = isShopifyExpanded ? shopifyProjects : shopifyProjects.slice(0, 3);

  return (
    <div id="projects">
      {/* SECTION 1: MERN Stack Projects */}
      <section ref={mernRef} className="projects-section-block">
        <div className="container">
          <div className="projects-header">
            <div>
              <h2 className="section-title">MERN Stack Projects</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Full-stack web applications engineered with MongoDB, Express, React, and Node.js.
              </p>
            </div>
            {mernProjects.length > 3 && (
              <button 
                onClick={() => setIsMernExpanded(!isMernExpanded)} 
                className="explore-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {isMernExpanded ? (
                  <>Show Less <i className="fas fa-chevron-up"></i></>
                ) : (
                  <>Explore All Projects ({mernProjects.length}) <i className="fas fa-arrow-right"></i></>
                )}
              </button>
            )}
          </div>

          <div className="projects-grid">
            {displayedMernProjects.map((project, index) => (
              <div 
                key={project._id || index} 
                className={`project-card fade-up ${isMernVisible ? 'visible' : ''}`} 
                style={{ transitionDelay: `${(index % 3) * 0.15}s` }}
              >
                <div className="project-img">
                  <img src={project.img} alt={project.title} />
                </div>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.desc}</p>
                  <div className="project-tags">
                    {Array.isArray(project.tags) && project.tags.map((tag, i) => (
                      <span key={i} className="project-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noreferrer" className="project-link link-primary">
                        Live Demo <i className="fas fa-arrow-right"></i>
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" className="project-link link-outline">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Explore All Button for MERN if not top header toggle */}
          {mernProjects.length > 3 && (
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <button
                onClick={() => setIsMernExpanded(!isMernExpanded)}
                className="btn btn-outline"
                style={{ borderRadius: '30px', padding: '0.8rem 2rem' }}
              >
                {isMernExpanded ? 'Show Less MERN Projects' : 'Explore All MERN Projects'} <i className={`fas ${isMernExpanded ? 'fa-chevron-up' : 'fa-arrow-right'}`}></i>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: Shopify Project Stores */}
      <section ref={shopifyRef} className="projects-section-block" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div className="projects-header">
            <div>
              <h2 className="section-title">Shopify Project Stores</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                High-converting e-commerce storefronts, custom Liquid themes, and Shopify app integrations.
              </p>
            </div>
            {shopifyProjects.length > 3 && (
              <button 
                onClick={() => setIsShopifyExpanded(!isShopifyExpanded)} 
                className="explore-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {isShopifyExpanded ? (
                  <>Show Less <i className="fas fa-chevron-up"></i></>
                ) : (
                  <>Explore All Projects ({shopifyProjects.length}) <i className="fas fa-arrow-right"></i></>
                )}
              </button>
            )}
          </div>

          <div className="projects-grid">
            {displayedShopifyProjects.map((project, index) => (
              <div 
                key={project._id || index} 
                className={`project-card fade-up ${isShopifyVisible ? 'visible' : ''}`} 
                style={{ transitionDelay: `${(index % 3) * 0.15}s` }}
              >
                <div className="project-img">
                  <img src={project.img} alt={project.title} />
                </div>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.desc}</p>
                  <div className="project-tags">
                    {Array.isArray(project.tags) && project.tags.map((tag, i) => (
                      <span key={i} className="project-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noreferrer" className="project-link link-primary">
                        Live Store <i className="fas fa-shopping-bag"></i>
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" className="project-link link-outline">
                        GitHub / Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Explore All Button for Shopify */}
          {shopifyProjects.length > 3 && (
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <button
                onClick={() => setIsShopifyExpanded(!isShopifyExpanded)}
                className="btn btn-outline"
                style={{ borderRadius: '30px', padding: '0.8rem 2rem' }}
              >
                {isShopifyExpanded ? 'Show Less Shopify Projects' : 'Explore All Shopify Stores'} <i className={`fas ${isShopifyExpanded ? 'fa-chevron-up' : 'fa-arrow-right'}`}></i>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
