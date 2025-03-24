// Local Storage Service for storing blogs, videos, and contacts

// Storage keys
const BLOGS_STORAGE_KEY = 'knowledge-hub-blogs';
const VIDEOS_STORAGE_KEY = 'knowledge-hub-videos';
const CONTACTS_STORAGE_KEY = 'knowledge-hub-contacts';

// Initialize local storage with sample data if empty
function initializeStorage() {
  // Check if blogs exist, if not add sample data
  if (!localStorage.getItem(BLOGS_STORAGE_KEY)) {
    const sampleBlogs = [
      {
        id: 1,
        title: 'Getting Started with JavaScript',
        content: 'JavaScript is a versatile programming language primarily known for creating interactive effects within web browsers. It\'s a core technology of the World Wide Web alongside HTML and CSS. This blog will help beginners understand the fundamentals of JavaScript and how to start coding with it.',
        category: 'Programming',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        authorName: 'John Doe',
        views: 120,
        createdAt: new Date(2024, 2, 15).toISOString()
      },
      {
        id: 2,
        title: 'Understanding Data Structures',
        content: 'Data structures are specialized formats for organizing, processing, retrieving and storing data. There are several basic and advanced types of data structures, all designed to arrange data to suit a specific purpose. This article explains the most important data structures every programmer should know.',
        category: 'Computer Science',
        imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d',
        authorName: 'Jane Smith',
        views: 85,
        createdAt: new Date(2024, 2, 18).toISOString()
      },
      {
        id: 3,
        title: 'Introduction to Web Design',
        content: 'Good web design involves understanding the principles of visual hierarchy, color theory, typography, and user experience. This blog post introduces the fundamental concepts of web design and provides practical tips for creating visually appealing and user-friendly websites.',
        category: 'Design',
        imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e',
        authorName: 'Alex Johnson',
        views: 210,
        createdAt: new Date(2024, 2, 20).toISOString()
      }
    ];
    
    localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(sampleBlogs));
  }
  
  // Check if videos exist, if not add sample data
  if (!localStorage.getItem(VIDEOS_STORAGE_KEY)) {
    const sampleVideos = [
      {
        id: 1,
        title: 'JavaScript for Beginners',
        category: 'Programming',
        authorName: 'John Doe',
        views: 523,
        createdAt: new Date(2024, 2, 10).toISOString(),
        description: 'Learn the basics of JavaScript programming in this comprehensive tutorial for beginners.',
        thumbnailUrl: 'https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg',
        videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
        duration: 30
      },
      {
        id: 2,
        title: 'CSS Flexbox and Grid Tutorial',
        category: 'Web Development',
        authorName: 'Jane Smith',
        views: 342,
        createdAt: new Date(2024, 2, 12).toISOString(),
        description: 'Master CSS Flexbox and Grid layout systems for responsive web design.',
        thumbnailUrl: 'https://img.youtube.com/vi/JJSoEo8JSnc/maxresdefault.jpg',
        videoUrl: 'https://www.youtube.com/embed/JJSoEo8JSnc',
        duration: 25
      },
      {
        id: 3,
        title: 'React Hooks Explained',
        category: 'React',
        authorName: 'Alex Johnson',
        views: 412,
        createdAt: new Date(2024, 2, 15).toISOString(),
        description: 'Detailed explanation of React Hooks and how to use them effectively in your projects.',
        thumbnailUrl: 'https://img.youtube.com/vi/TNhaISOUy6Q/maxresdefault.jpg',
        videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q',
        duration: 42
      }
    ];
    
    localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(sampleVideos));
  }
  
  // Initialize empty contacts if not exists
  if (!localStorage.getItem(CONTACTS_STORAGE_KEY)) {
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify([]));
  }
}

// Blog operations
function getAllBlogs(limit) {
  const blogs = JSON.parse(localStorage.getItem(BLOGS_STORAGE_KEY)) || [];
  const sortedBlogs = blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  if (limit && limit > 0) {
    return sortedBlogs.slice(0, limit);
  }
  
  return sortedBlogs;
}

function getBlogById(id) {
  const blogs = getAllBlogs();
  return blogs.find(blog => blog.id === id);
}

function createBlog(blog) {
  const blogs = getAllBlogs();
  const newId = blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1;
  
  const newBlog = {
    ...blog,
    id: newId,
    views: 0,
    createdAt: new Date().toISOString()
  };
  
  blogs.push(newBlog);
  localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(blogs));
  
  return newBlog;
}

function deleteBlog(id) {
  const blogs = getAllBlogs();
  const updatedBlogs = blogs.filter(blog => blog.id !== id);
  
  localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(updatedBlogs));
}

// Video operations
function getAllVideos(limit) {
  const videos = JSON.parse(localStorage.getItem(VIDEOS_STORAGE_KEY)) || [];
  const sortedVideos = videos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  if (limit && limit > 0) {
    return sortedVideos.slice(0, limit);
  }
  
  return sortedVideos;
}

function getVideoById(id) {
  const videos = getAllVideos();
  return videos.find(video => video.id === id);
}

function createVideo(video) {
  const videos = getAllVideos();
  const newId = videos.length > 0 ? Math.max(...videos.map(v => v.id)) + 1 : 1;
  
  const newVideo = {
    ...video,
    id: newId,
    views: 0,
    createdAt: new Date().toISOString()
  };
  
  videos.push(newVideo);
  localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videos));
  
  return newVideo;
}

function deleteVideo(id) {
  const videos = getAllVideos();
  const updatedVideos = videos.filter(video => video.id !== id);
  
  localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(updatedVideos));
}

// Contact operations
function createContact(contact) {
  const contacts = JSON.parse(localStorage.getItem(CONTACTS_STORAGE_KEY)) || [];
  const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
  
  const newContact = {
    ...contact,
    id: newId,
    createdAt: new Date().toISOString()
  };
  
  contacts.push(newContact);
  localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
  
  return newContact;
}

// Initialize the storage with sample data if needed
initializeStorage();