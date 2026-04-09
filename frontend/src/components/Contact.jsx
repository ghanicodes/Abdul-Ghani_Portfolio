import React, { useState, useEffect, useRef } from 'react';

const Contact = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("--- Fetching from Vercel Backend (React) ---");
      const response = await fetch(`${apiBaseUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Success!', 'Thank you for your message! I will get back to you soon.', 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        showNotification('Error', data.message || 'Failed to send message.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Connection Error', 'Server is not responding.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toast logic ported to React
  const showNotification = (title, message, type) => {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.innerHTML = `
      <div class="toast-icon"><i class="fas ${icon}"></i></div>
      <div class="toast-content">
          <h4>${title}</h4>
          <p>${message}</p>
      </div>
      <div class="toast-close"><i class="fas fa-times"></i></div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    
    const hideToast = () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    };

    const timeout = setTimeout(hideToast, 5000);
    toast.querySelector('.toast-close').onclick = () => {
      clearTimeout(timeout);
      hideToast();
    };
  };

  return (
    <section id="contact" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-container">
          <div className={`contact-info ${isVisible ? 'visible' : ''}`}>
            <h3>Let's Talk</h3>
            <p>I'm available for internships and freelance projects. Feel free to contact me for collaborations or opportunities.</p>
            <ul className="contact-details">
              <li><i className="fas fa-map-marker-alt"></i><span>Karachi, Pakistan</span></li>
              <li><i className="fas fa-envelope"></i><a href="mailto:abdulghaniag1010@gmail.com">abdulghaniag1010@gmail.com</a></li>
              <li><i className="fas fa-phone"></i><a href="tel:+923181168965">+92 318 1168965</a></li>
            </ul>
            <div className="social-links">
              <a href="https://github.com/ghanicodes" className="social-link"><i className="fab fa-github"></i></a>
              <a href="https://www.linkedin.com/in/abdul-ghani-a645202b9/" className="social-link"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
          <div className={`contact-form ${isVisible ? 'visible' : ''}`}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="text" id="name" className="form-control" placeholder="Your Name" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <input type="email" id="email" className="form-control" placeholder="Your Email" required value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <input type="text" id="subject" class="form-control" placeholder="Subject" value={formData.subject} onChange={handleChange} />
              </div>
              <div className="form-group">
                <textarea id="message" className="form-control" placeholder="Your Message" required value={formData.message} onChange={handleChange}></textarea>
              </div>
              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
