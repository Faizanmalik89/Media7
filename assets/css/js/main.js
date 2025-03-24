// Main application script

// DOM elements
const menuToggle = document.getElementById('menuToggle');
const menuDropdown = document.getElementById('menuDropdown');
const authModal = document.getElementById('authModal');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');
const signInButton = document.getElementById('signInButton');
const signUpButton = document.getElementById('signUpButton');
const switchToSignUp = document.getElementById('switchToSignUp');
const switchToSignIn = document.getElementById('switchToSignIn');
const closeButtons = document.querySelectorAll('.close');
const videoPlayerModal = document.getElementById('videoPlayerModal');
const blogForm = document.getElementById('blogForm');
const videoForm = document.getElementById('videoForm');
const contactForm = document.getElementById('contactForm');
const adminTabs = document.querySelectorAll('.tab-btn');

// Initialize application
function initApp() {
  // Set up event listeners
  setupNavigationListeners();
  setupAuthModalListeners();
  setupFormSubmitListeners();
  setupAdminTabListeners();
  setupModalCloseListeners();
  
  // Show home page by default
  showPage('home');
}

// Set up navigation event listeners
function setupNavigationListeners() {
  // Toggle menu dropdown
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuDropdown.classList.toggle('active');
    });
  }
  
  // Page navigation links
  document.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-page')) {
      e.preventDefault();
      
      const pageId = e.target.getAttribute('data-page');
      
      // Check if admin page requested and user has permission
      if (pageId === 'admin' && !checkAdminAccess()) {
        return;
      }
      
      showPage(pageId);
    }
  });
  
  // Sign in link
  document.addEventListener('click', (e) => {
    if (e.target.id === 'signInLink') {
      e.preventDefault();
      openAuthModal();
    }
  });
}

// Set up authentication modal listeners
function setupAuthModalListeners() {
  // Switch between sign in and sign up forms
  if (switchToSignUp) {
    switchToSignUp.addEventListener('click', (e) => {
      e.preventDefault();
      signInForm.classList.add('hidden');
      signUpForm.classList.remove('hidden');
    });
  }
  
  if (switchToSignIn) {
    switchToSignIn.addEventListener('click', (e) => {
      e.preventDefault();
      signUpForm.classList.add('hidden');
      signInForm.classList.remove('hidden');
    });
  }
  
  // Sign in button
  if (signInButton) {
    signInButton.addEventListener('click', () => {
      const email = document.getElementById('signInEmail').value;
      const password = document.getElementById('signInPassword').value;
      
      if (!email || !password) {
        showToast('Please enter email and password', 'error');
        return;
      }
      
      signIn(email, password)
        .then((user) => {
          closeAuthModal();
          showToast('Signed in successfully', 'success');
        })
        .catch((error) => {
          showToast(`Error: ${error.message}`, 'error');
        });
    });
  }
  
  // Sign up button
  if (signUpButton) {
    signUpButton.addEventListener('click', () => {
      const email = document.getElementById('signUpEmail').value;
      const password = document.getElementById('signUpPassword').value;
      const confirmPassword = document.getElementById('signUpConfirmPassword').value;
      
      if (!email || !password) {
        showToast('Please enter email and password', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
      
      signUp(email, password)
        .then((user) => {
          closeAuthModal();
          showToast('Account created successfully', 'success');
        })
        .catch((error) => {
          showToast(`Error: ${error.message}`, 'error');
        });
    });
  }
}

// Set up form submit listeners
function setupFormSubmitListeners() {
  // Blog form
  if (blogForm) {
    blogForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!checkAdminAccess()) return;
      
      const formData = new FormData(blogForm);
      const blogData = {
        title: formData.get('title'),
        category: formData.get('category'),
        content: formData.get('content'),
        imageUrl: formData.get('imageUrl') || null,
        authorName: currentUser ? currentUser.email.split('@')[0] : 'Admin'
      };
      
      createBlog(blogData);
      blogForm.reset();
      showToast('Blog post added successfully', 'success');
      renderAdminDashboard();
    });
  }
  
  // Video form
  if (videoForm) {
    videoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!checkAdminAccess()) return;
      
      const formData = new FormData(videoForm);
      const videoData = {
        title: formData.get('title'),
        category: formData.get('category'),
        description: formData.get('description'),
        videoUrl: formData.get('videoUrl'),
        thumbnailUrl: formData.get('thumbnailUrl') || null,
        duration: parseInt(formData.get('duration'), 10) || 0,
        authorName: currentUser ? currentUser.email.split('@')[0] : 'Admin'
      };
      
      createVideo(videoData);
      videoForm.reset();
      showToast('Video added successfully', 'success');
      renderAdminDashboard();
    });
  }
  
  // Contact form
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
      };
      
      createContact(contactData);
      contactForm.reset();
      showToast('Message sent successfully. We will get back to you soon!', 'success');
    });
  }
}

// Set up admin tab listeners
function setupAdminTabListeners() {
  if (adminTabs) {
    adminTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        adminTabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Hide all tab content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Show selected tab content
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }
}

// Set up modal close listeners
function setupModalCloseListeners() {
  // Close buttons
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Close auth modal
      authModal.classList.remove('active');
      
      // Close video player modal
      videoPlayerModal.classList.remove('active');
      
      // Clear video player
      const videoContainer = document.getElementById('videoPlayerContainer');
      if (videoContainer) {
        videoContainer.innerHTML = '';
      }
    });
  });
  
  // Close modal when clicking outside of modal content
  window.addEventListener('click', (e) => {
    if (e.target === authModal) {
      authModal.classList.remove('active');
    }
    
    if (e.target === videoPlayerModal) {
      videoPlayerModal.classList.remove('active');
      
      // Clear video player
      const videoContainer = document.getElementById('videoPlayerContainer');
      if (videoContainer) {
        videoContainer.innerHTML = '';
      }
    }
  });
}

// Render blogs
function renderBlogs() {
  const blogsList = document.getElementById('blogsList');
  if (!blogsList) return;
  
  blogsList.innerHTML = '';
  
  const blogs = getAllBlogs();
  
  if (blogs.length === 0) {
    blogsList.innerHTML = '<p class="no-content">No blog posts available</p>';
    return;
  }
  
  blogs.forEach(blog => {
    const blogCard = createBlogCard(blog);
    blogsList.appendChild(blogCard);
  });
}

// Render videos
function renderVideos() {
  const videosList = document.getElementById('videosList');
  if (!videosList) return;
  
  videosList.innerHTML = '';
  
  const videos = getAllVideos();
  
  if (videos.length === 0) {
    videosList.innerHTML = '<p class="no-content">No videos available</p>';
    return;
  }
  
  videos.forEach(video => {
    const videoCard = createVideoCard(video, openVideoPlayer);
    videosList.appendChild(videoCard);
  });
}

// Render admin dashboard
function renderAdminDashboard() {
  if (!checkAdminAccess()) return;
  
  const adminBlogsList = document.getElementById('adminBlogsList');
  const adminVideosList = document.getElementById('adminVideosList');
  
  if (adminBlogsList) {
    adminBlogsList.innerHTML = '';
    
    const blogs = getAllBlogs();
    
    if (blogs.length === 0) {
      adminBlogsList.innerHTML = '<p class="no-content">No blog posts available</p>';
    } else {
      blogs.forEach(blog => {
        const blogItem = createAdminBlogItem(blog, (id) => {
          deleteBlog(id);
          renderAdminDashboard();
          showToast('Blog post deleted successfully', 'success');
        });
        adminBlogsList.appendChild(blogItem);
      });
    }
  }
  
  if (adminVideosList) {
    adminVideosList.innerHTML = '';
    
    const videos = getAllVideos();
    
    if (videos.length === 0) {
      adminVideosList.innerHTML = '<p class="no-content">No videos available</p>';
    } else {
      videos.forEach(video => {
        const videoItem = createAdminVideoItem(video, (id) => {
          deleteVideo(id);
          renderAdminDashboard();
          showToast('Video deleted successfully', 'success');
        });
        adminVideosList.appendChild(videoItem);
      });
    }
  }
}

// Render featured content
function renderFeaturedContent() {
  const featuredBlogs = document.getElementById('featuredBlogs');
  const featuredVideos = document.getElementById('featuredVideos');
  
  if (featuredBlogs) {
    featuredBlogs.innerHTML = '<h3>Featured Blogs</h3>';
    
    const blogs = getAllBlogs(3);
    
    if (blogs.length === 0) {
      featuredBlogs.innerHTML += '<p class="no-content">No blog posts available</p>';
    } else {
      blogs.forEach(blog => {
        const blogCard = createBlogCard(blog);
        featuredBlogs.appendChild(blogCard);
      });
    }
  }
  
  if (featuredVideos) {
    featuredVideos.innerHTML = '<h3>Featured Videos</h3>';
    
    const videos = getAllVideos(3);
    
    if (videos.length === 0) {
      featuredVideos.innerHTML += '<p class="no-content">No videos available</p>';
    } else {
      videos.forEach(video => {
        const videoCard = createVideoCard(video, openVideoPlayer);
        featuredVideos.appendChild(videoCard);
      });
    }
  }
}

// Open authentication modal
function openAuthModal() {
  authModal.classList.add('active');
  signInForm.classList.remove('hidden');
  signUpForm.classList.add('hidden');
}

// Close authentication modal
function closeAuthModal() {
  authModal.classList.remove('active');
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);