import Project from './model/Project.js';

export const initialProjects = [
  // --- MERN Stack Projects ---
  {
    title: 'Bootcamp Tracker – Full-Stack LMS',
    img: '/images/bootcamp-tracker.png',
    desc: 'A scalable full-stack SPA for student progress tracking. Includes secure JWT authentication, role-based dashboards (Admin, Teacher, Student), and modules for assignments and attendance.',
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    live: 'https://boot-camp-tracker.vercel.app',
    github: 'https://github.com/ghanicodes',
    category: 'mern',
    isFeatured: true,
    order: 1,
    status: 'active',
  },
  {
    title: 'Social Vibes – Real-Time Social Media',
    img: '/images/SocialVibes.jpg',
    desc: 'A full-stack Instagram-like social media app with authentication, real-time posts, likes, comments, sharing, and image uploads powered by Supabase.',
    tags: ['HTML', 'CSS', 'JavaScript', 'SupaBase'],
    live: 'https://thesocialvibes.netlify.app/',
    github: 'https://github.com/ghanicodes',
    category: 'mern',
    isFeatured: true,
    order: 2,
    status: 'active',
  },
  {
    title: 'OLX Clone Admin Panel',
    img: '/images/olx-imge.jpg',
    desc: 'A real-world marketplace application where authenticated users can post items for sale, purchase products, and manage listings through an integrated admin dashboard.',
    tags: ['HTML', 'CSS', 'JavaScript', 'SupaBase'],
    live: 'https://olx-clone-e-commerce.netlify.app/',
    github: 'https://github.com/ghanicodes',
    category: 'mern',
    isFeatured: true,
    order: 3,
    status: 'active',
  },

  // --- Shopify Projects ---
  {
    title: 'CAMÓRE Jewelry',
    img: '/images/shopify-store-1.jpg',
    desc: 'A high-end luxury fashion and jewelry Shopify store featuring custom Liquid section architecture, dynamic AJAX cart drawer, size selector popup, and optimized checkout flow.',
    tags: ['Shopify', 'Liquid', 'JavaScript', 'CSS3', 'Shopify Pay'],
    live: 'https://aurelialuxe-demo.myshopify.com',
    github: 'https://github.com/ghanicodes',
    category: 'shopify',
    isFeatured: true,
    order: 1,
    status: 'active',
  },
  {
    title: 'Prieur USA',
    img: '/images/shopify-store-2.jpg',
    desc: 'A modern skincare and beauty Shopify store with custom product filtering, shade finder quiz integration, subscription options, and hyper-responsive UI.',
    tags: ['Shopify Plus', 'Liquid', 'HTML5', 'Sass', 'Klaviyo'],
    live: 'https://glowandco-demo.myshopify.com',
    github: 'https://github.com/ghanicodes',
    category: 'shopify',
    isFeatured: true,
    order: 2,
    status: 'active',
  },
  {
    title: 'Springwell Publishing',
    img: '/images/shopify-store-3.jpg',
    desc: 'An immersive digital publishing and store platform built on Shopify. Includes dynamic product variant comparison, custom badges, and high conversion rate optimization.',
    tags: ['Shopify', 'Liquid', 'Tailwind', 'JavaScript', 'REST API'],
    live: 'https://voltgaming-demo.myshopify.com',
    github: 'https://github.com/ghanicodes',
    category: 'shopify',
    isFeatured: true,
    order: 3,
    status: 'active',
  },
];

export const autoSeedProjects = async () => {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial MERN and Shopify projects...');
      await Project.insertMany(initialProjects);
      console.log('✅ Default projects seeded successfully!');
    } else {
      // Update existing Shopify titles if needed
      await Project.updateOne({ category: 'shopify', order: 1 }, { title: 'CAMÓRE Jewelry' });
      await Project.updateOne({ category: 'shopify', order: 2 }, { title: 'Prieur USA' });
      await Project.updateOne({ category: 'shopify', order: 3 }, { title: 'Springwell Publishing' });
    }
  } catch (error) {
    console.error('❌ Failed to auto-seed projects:', error.message);
  }
};
