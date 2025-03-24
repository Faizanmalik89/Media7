// UI utility functions

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('active');
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// Create blog card element
function createBlogCard(blog) {
  const blogCard = document.createElement('div');
  blogCard.className = 'blog-card';
  
  const truncatedContent = blog.content.length > 150 
    ? blog.content.substring(0, 150) + '...' 
    : blog.content;
  
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  blogCard.innerHTML = `
    <img src="${blog.imageUrl || 'https://via.placeholder.com/300x200'}" alt="${blog.title}" class="blog-image">
    <div class="blog-content">
      <span class="blog-category">${blog.category}</span>
      <h3 class="blog-title">${blog.title}</h3>
      <p class="blog-excerpt">${truncatedContent}</p>
      <div class="blog-footer">
        <span>By ${blog.authorName}</span>
        <span>${formattedDate}</span>
      </div>
    </div>
  `;
  
  return blogCard;
}

// Create video card element
function createVideoCard(video, onPlay) {
  const videoCard = document.createElement('div');
  videoCard.className = 'video-card';
  videoCard.dataset.videoId = video.id;
  
  const truncatedDescription = video.description.length > 100 
    ? video.description.substring(0, 100) + '...' 
    : video.description;
  
  const formattedDate = new Date(video.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  videoCard.innerHTML = `
    <div class="video-thumbnail-container">
      <img src="${video.thumbnailUrl || 'https://via.placeholder.com/300x200'}" alt="${video.title}" class="video-thumbnail">
      <div class="play-button">▶</div>
    </div>
    <div class="video-content">
      <span class="video-category">${video.category}</span>
      <h3 class="video-title">${video.title}</h3>
      <p class="video-description">${truncatedDescription}</p>
      <div class="video-footer">
        <span>By ${video.authorName}</span>
        <div class="video-duration">
          <span>⏱️ ${video.duration} min</span>
        </div>
      </div>
    </div>
  `;
  
  // Add click event to play video
  videoCard.addEventListener('click', () => {
    if (typeof onPlay === 'function') {
      onPlay(video.id);
    }
  });
  
  return videoCard;
}

// Create admin blog item element
function createAdminBlogItem(blog, onDelete) {
  const adminItem = document.createElement('div');
  adminItem.className = 'admin-item';
  adminItem.dataset.id = blog.id;
  
  adminItem.innerHTML = `
    <div class="admin-item-info">
      <div class="admin-item-title">${blog.title}</div>
      <div class="admin-item-category">${blog.category}</div>
    </div>
    <button class="admin-item-action">Delete</button>
  `;
  
  // Add delete event listener
  const deleteButton = adminItem.querySelector('.admin-item-action');
  deleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof onDelete === 'function') {
      onDelete(blog.id);
    }
  });
  
  return adminItem;
}

// Create admin video item element
function createAdminVideoItem(video, onDelete) {
  const adminItem = document.createElement('div');
  adminItem.className = 'admin-item';
  adminItem.dataset.id = video.id;
  
  adminItem.innerHTML = `
    <div class="admin-item-info">
      <div class="admin-item-title">${video.title}</div>
      <div class="admin-item-category">${video.category}</div>
    </div>
    <button class="admin-item-action">Delete</button>
  `;
  
  // Add delete event listener
  const deleteButton = adminItem.querySelector('.admin-item-action');
  deleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof onDelete === 'function') {
      onDelete(video.id);
    }
  });
  
  return adminItem;
}

// Open video player modal
function openVideoPlayer(videoId) {
  const video = getVideoById(videoId);
  if (!video) return;
  
  const modal = document.getElementById('videoPlayerModal');
  const videoContainer = document.getElementById('videoPlayerContainer');
  
  videoContainer.innerHTML = `<iframe src="${video.videoUrl}" allowfullscreen></iframe>`;
  modal.classList.add('active');
}

// Show specified page and hide others
function showPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show requested page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    
    // Update menu items active state
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-page') === pageId) {
        item.classList.add('active');
      }
    });
    
    // Close menu dropdown after selection on mobile
    const menuDropdown = document.getElementById('menuDropdown');
    menuDropdown.classList.remove('active');
    
    // Special handling for specific pages
    if (pageId === 'blogs') {
      renderBlogs();
    } else if (pageId === 'videos') {
      renderVideos();
    } else if (pageId === 'admin') {
      renderAdminDashboard();
    } else if (pageId === 'home') {
      renderFeaturedContent();
    }
  }
}

// Check if user has permission to access admin page
function checkAdminAccess() {
  if (!isAdmin(currentUser)) {
    showToast('You do not have permission to access the admin dashboard', 'error');
    showPage('home');
    return false;
  }
  return true;
}