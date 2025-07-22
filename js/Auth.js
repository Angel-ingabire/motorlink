// Authentication JavaScript for MotorLink
// Handles login, signup, and user session management with FastAPI backend

document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

// Base API configuration
const API_BASE_URL = 'http://localhost:8000'; 
const AUTH_TOKEN_KEY = 'motorlink_auth_token';
const CURRENT_USER_KEY = 'motorlink_current_user';

function initializeAuth() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const userTypeRadios = document.querySelectorAll('input[name="userType"]');
    
    if (loginForm) {
        initializeLoginForm(loginForm);
    }
    
    if (signupForm) {
        initializeSignupForm(signupForm);
    }
    
    if (userTypeRadios.length > 0) {
        initializeUserTypeSelection(userTypeRadios);
    }
    
    // Check if user is already logged in
    checkAuthStatus();
}

// Initialize login form with JWT authentication
async function initializeLoginForm(form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        try {
            submitButton.disabled = true;
            submitButton.innerHTML = 'Signing in...';
            
            const formData = new FormData(form);
            const params = new URLSearchParams();
            params.append('username', formData.get('email').trim());
            params.append('password', formData.get('password').trim());
            params.append('grant_type', 'password');

            const response = await fetch(`${API_BASE_URL}/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Login failed');
            }

            const { access_token } = await response.json();
            localStorage.setItem('motorlink_auth_token', access_token);
            // Then fetch user data separately
            const userResponse = await fetch(`${API_BASE_URL}/users/me/`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
            const user = await userResponse.json();
            
            localStorage.setItem('motorlink_current_user', JSON.stringify({
                id: user.id,
                email: user.email
            }));

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 100);

        } catch (error) {
            showNotification(error.message || 'Login failed', 'error');
            console.error('Login error:', error);
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
}

function initializeSignupForm(form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        try {
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner"></span> Creating account...';
            
            // Get form data
            const formData = new FormData(form);
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');
            
            // Validate password match
            if (password !== confirmPassword) {
                throw new Error("Passwords don't match");
            }
            
            // Prepare data for backend
            const signupData = {
                email: formData.get('email').trim(),
                password: password,
                full_name: formData.get('fullName').trim(),
                phone_number: formData.get('phone').trim(),
                user_type: formData.get('userType') === 'rider' ? 'driver' : 'passenger'
            };
            
            // Basic validation
            if (!signupData.email.includes('@')) {
                throw new Error('Please enter a valid email');
            }
            if (signupData.password.length < 8) {
                throw new Error('Password must be at least 8 characters');
            }
            if (!signupData.phone_number.startsWith('+')) {
                throw new Error('Phone number must start with +');
            }
            
            console.log('Submitting signup data:', signupData); // Debug log
            
            // Send to backend
            const response = await fetch(`${API_BASE_URL}/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupData)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Signup failed');
            }
            
            const user = await response.json();
            console.log('Signup successful:', user); // Debug log
            
            // Automatically log the user in after signup
            const loginResponse = await fetch(`${API_BASE_URL}/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    username: signupData.email,
                    password: signupData.password,
                    grant_type: 'password'
                })
            });
            
            if (!loginResponse.ok) {
                throw new Error('Account created but login failed');
            }
            
            const { access_token } = await loginResponse.json();
            localStorage.setItem('motorlink_auth_token', access_token);
            
            // Fetch user details
            const userResponse = await fetch(`${API_BASE_URL}/users/me/`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
            const userDetails = await userResponse.json();
            
            localStorage.setItem('motorlink_current_user', JSON.stringify(userDetails));
            
            showNotification('Account created successfully!', 'success');
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            console.error('Signup error:', error);
            showNotification(error.message || 'Signup failed. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
}

// Enhanced validation functions
function validateLoginForm(data) {
    const errors = [];
    
    if (!data.username) {
        errors.push('Email is required');
    } else if (!utils.validateEmail(data.username)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.password) {
        errors.push('Password is required');
    } else if (data.password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }
    
    return errors;
}

function validateSignupForm(data) {
    const errors = [];
    
    // Email validation
    if (!data.email) {
        errors.push('Email is required');
    } else if (!utils.validateEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Password validation
    if (!data.password) {
        errors.push('Password is required');
    } else if (data.password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }
    
    // Name validation
    if (!data.full_name) {
        errors.push('Full name is required');
    }
    
    // Phone validation
    if (!data.phone_number) {
        errors.push('Phone number is required');
    }
    
    // User type validation
    if (!data.user_type) {
        errors.push('Please select a user type');
    }
    
    return errors;
}

// // Fetch current user from API
async function fetchCurrentUser() {
    try {
        const token = storage.get(AUTH_TOKEN_KEY);
        if (!token) return null;
        
        const user = await makeApiRequest('/users/me/', 'GET', null, token);
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return null;
    }
}

// API request helper with auth support
async function makeApiRequest(endpoint, method = 'GET', data = null) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: data ? JSON.stringify(data) : undefined
    };

    // Add auth token if exists
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || `HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', {
            endpoint,
            error: error.message,
            config
        });
        throw new Error(`Network error: ${error.message}`);
    }
}

// Validate login form
function validateLoginForm(data) {
    const errors = [];
    
    if (!data.username || !utils.validateEmail(data.username)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.password || data.password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }
    
    return errors;
}

// Check authentication status with JWT
function checkAuthStatus() {
    const token = localStorage.getItem('motorlink_auth_token');
    const user = localStorage.getItem('motorlink_current_user');
    
    return !!token;
}

// Logout function - clears all auth data
function logout() {
    storage.remove(AUTH_TOKEN_KEY);
    storage.remove(CURRENT_USER_KEY);
    storage.remove('isLoggedIn');
    showNotification('Logged out successfully', 'info');
    window.location.href = 'index.html';
}

// Password reset with API integration
async function resetPassword(email) {
    if (!email || !utils.validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        await makeApiRequest('/password-reset/', 'POST', { email });
        showNotification('Password reset instructions sent to your email', 'success');
    } catch (error) {
        showNotification(error.message || 'Failed to send reset instructions', 'error');
    }
}

// Utility functions
const utils = {
    validateEmail: (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
};

const loading = {
    show: (element, text) => {
        element.innerHTML = text;
        element.disabled = true;
    },
    hide: (element, originalText) => {
        element.innerHTML = originalText;
        element.disabled = false;
    }
};

const storage = {
    get: (key) => {
        return localStorage.getItem(key);
    },
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove: (key) => {
        localStorage.removeItem(key);
    }
};

const showNotification = (message, type = 'info') => {
    // Implement your notification system here
    alert(`${type.toUpperCase()}: ${message}`);
};

function handleGoogleLogin() {
  console.log("Google login would be implemented here");
  // Implementation would use Firebase or OAuth
}

function handleFacebookLogin() {
  console.log("Facebook login would be implemented here");
}

function initializeUserTypeSelection(radios) {
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      console.log("User type selected:", radio.value);
    });
  });
}

// Expose functions for HTML onclick handlers
window.logout = logout;
window.handleGoogleLogin = handleGoogleLogin;
window.handleFacebookLogin = handleFacebookLogin;
window.resetPassword = resetPassword;