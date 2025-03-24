// Authentication state tracking
let currentUser = null;
const ADMIN_EMAIL = 'faizanmaliks888@gmail.com';

// Check if user is admin
function isAdmin(user) {
  return user && user.email === ADMIN_EMAIL;
}

// Get user initials for avatar
function getUserInitials(user) {
  if (!user || !user.email) return 'U';
  return user.email.charAt(0).toUpperCase();
}

// Sign in with email and password
function signIn(email, password) {
  return auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      return userCredential.user;
    });
}

// Sign up with email and password
function signUp(email, password) {
  return auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      return userCredential.user;
    });
}

// Sign out
function signOut() {
  return auth.signOut();
}

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
  currentUser = user;
  console.log('Auth state updated:', user ? user.email : 'No user');
  
  // Update UI based on auth state
  updateAuthUI();
  
  // Show/hide admin dashboard
  const adminPage = document.getElementById('admin');
  if (adminPage) {
    if (isAdmin(user)) {
      // Add admin page to menu only for admin users
      const menuDropdown = document.getElementById('menuDropdown');
      if (!document.querySelector('[data-page="admin"]')) {
        const adminLink = document.createElement('a');
        adminLink.href = '#';
        adminLink.className = 'menu-item';
        adminLink.setAttribute('data-page', 'admin');
        adminLink.textContent = 'Admin Dashboard';
        menuDropdown.appendChild(adminLink);
      }
    } else {
      // Remove admin link for non-admin users
      const adminLink = document.querySelector('[data-page="admin"]');
      if (adminLink) {
        adminLink.remove();
      }
    }
  }
});

// Update UI based on authentication state
function updateAuthUI() {
  const authLinks = document.getElementById('authLinks');
  
  if (authLinks) {
    // Clear existing content
    authLinks.innerHTML = '';
    
    if (currentUser) {
      // User is signed in
      const userInfo = document.createElement('div');
      userInfo.className = 'user-info';
      
      const userEmail = document.createElement('span');
      userEmail.textContent = currentUser.email;
      userEmail.className = 'user-email';
      
      const signOutBtn = document.createElement('a');
      signOutBtn.href = '#';
      signOutBtn.className = 'menu-item';
      signOutBtn.textContent = 'Sign Out';
      signOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signOut()
          .then(() => {
            showToast('Signed out successfully', 'success');
          })
          .catch((error) => {
            showToast(`Error: ${error.message}`, 'error');
          });
      });
      
      authLinks.appendChild(userEmail);
      authLinks.appendChild(signOutBtn);
    } else {
      // User is signed out
      const signInLink = document.createElement('a');
      signInLink.href = '#';
      signInLink.className = 'menu-item';
      signInLink.id = 'signInLink';
      signInLink.textContent = 'Sign In';
      
      authLinks.appendChild(signInLink);
    }
  }
}