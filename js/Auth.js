// Authentication JavaScript for MotorLink
// Handles login, signup, and user session management

document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

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

// Initialize login form
function initializeLoginForm(form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        loading.show(submitButton, 'Signing in...');
        
        // Get form data
        const formData = new FormData(form);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember: formData.get('remember-me') === 'on'
        };
        
        try {
            // Validate form
            const errors = validation.validateForm(form);
            if (errors.length > 0) {
                throw new Error(errors[0]);
            }
            
            // Simulate API call
            await simulateLogin(loginData);
            
            // Store user session
            const userData = {
                email: loginData.email,
                name: getNameFromEmail(loginData.email),
                loginTime: new Date().toISOString(),
                remember: loginData.remember
            };
            
            storage.set('user', userData);
            storage.set('isLoggedIn', true);
            
            // Show success message
            showNotification('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            // Show error message
            showNotification(error.message, 'error');
            loading.hide(submitButton, originalText);
        }
    });
    
    // Real-time validation
    const emailInput = form.querySelector('#email');
    const passwordInput = form.querySelector('#password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !utils.validateEmail(this.value)) {
                validation.showFieldError(this, 'Please enter a valid email address');
            } else {
                validation.clearFieldError(this);
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (this.value.length > 0 && this.value.length < 6) {
                validation.showFieldError(this, 'Password must be at least 6 characters');
            } else {
                validation.clearFieldError(this);
            }
        });
    }
}

// Initialize signup form
function initializeSignupForm(form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        loading.show(submitButton, 'Creating account...');
        
        // Get form data
        const formData = new FormData(form);
        const signupData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            userType: document.querySelector('input[name="userType"]:checked').value,
            terms: formData.get('terms') === 'on'
        };
        
        try {
            // Validate form
            const errors = validateSignupForm(signupData);
            if (errors.length > 0) {
                throw new Error(errors[0]);
            }
            
            // Simulate API call
            await simulateSignup(signupData);
            
            // Store user session
            const userData = {
                email: signupData.email,
                name: signupData.fullName,
                phone: signupData.phone,
                userType: signupData.userType,
                loginTime: new Date().toISOString()
            };
            
            storage.set('user', userData);
            storage.set('isLoggedIn', true);
            
            // Show success message
            showNotification('Account created successfully! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            // Show error message
            showNotification(error.message, 'error');
            loading.hide(submitButton, originalText);
        }
    });
    
    // Real-time validation
    const emailInput = form.querySelector('#email');
    const phoneInput = form.querySelector('#phone');
    const passwordInput = form.querySelector('#password');
    const confirmPasswordInput = form.querySelector('#confirmPassword');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !utils.validateEmail(this.value)) {
                validation.showFieldError(this, 'Please enter a valid email address');
            } else {
                validation.clearFieldError(this);
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (this.value && !utils.validatePhone(this.value)) {
                validation.showFieldError(this, 'Please enter a valid Rwandan phone number');
            } else {
                validation.clearFieldError(this);
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (this.value.length > 0 && this.value.length < 6) {
                validation.showFieldError(this, 'Password must be at least 6 characters');
            } else {
                validation.clearFieldError(this);
            }
            
            // Check confirm password if it has a value
            if (confirmPasswordInput && confirmPasswordInput.value) {
                validatePasswordMatch(passwordInput, confirmPasswordInput);
            }
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordMatch(passwordInput, this);
        });
    }
}

// Initialize user type selection
function initializeUserTypeSelection(radios) {
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Update UI based on selected user type
            const userTypeInfo = document.querySelector('.user-type-info');
            if (userTypeInfo) {
                userTypeInfo.textContent = this.value === 'passenger' 
                    ? 'You\'ll be able to book rides and track your trips'
                    : 'You\'ll be able to offer rides and earn money';
            }
        });
    });
}

// Validate signup form
function validateSignupForm(data) {
    const errors = [];
    
    if (!data.fullName || data.fullName.trim().length < 2) {
        errors.push('Full name must be at least 2 characters');
    }
    
    if (!data.email || !utils.validateEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.phone || !utils.validatePhone(data.phone)) {
        errors.push('Please enter a valid Rwandan phone number');
    }
    
    if (!data.password || data.password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }
    
    if (data.password !== data.confirmPassword) {
        errors.push('Passwords do not match');
    }
    
    if (!data.terms) {
        errors.push('You must accept the Terms of Service and Privacy Policy');
    }
    
    return errors;
}

// Validate password match
function validatePasswordMatch(passwordInput, confirmPasswordInput) {
    if (passwordInput.value !== confirmPasswordInput.value) {
        validation.showFieldError(confirmPasswordInput, 'Passwords do not match');
    } else {
        validation.clearFieldError(confirmPasswordInput);
    }
}

// Simulate login API call
async function simulateLogin(loginData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate different login scenarios
            if (loginData.email === 'test@example.com' && loginData.password === 'wrong') {
                reject(new Error('Invalid email or password'));
            } else if (loginData.email === 'blocked@example.com') {
                reject(new Error('Account has been temporarily blocked'));
            } else if (!utils.validateEmail(loginData.email)) {
                reject(new Error('Please enter a valid email address'));
            } else if (loginData.password.length < 6) {
                reject(new Error('Password must be at least 6 characters'));
            } else {
                resolve({ success: true, user: { email: loginData.email } });
            }
        }, 1000);
    });
}

// Simulate signup API call
async function simulateSignup(signupData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate different signup scenarios
            if (signupData.email === 'existing@example.com') {
                reject(new Error('Email address is already registered'));
            } else if (signupData.phone === '+250788000000') {
                reject(new Error('Phone number is already registered'));
            } else {
                resolve({ success: true, user: { email: signupData.email } });
            }
        }, 1500);
    });
}

// Check authentication status
function checkAuthStatus() {
    const isLoggedIn = storage.get('isLoggedIn');
    const user = storage.get('user');
    
    if (isLoggedIn && user) {
        // Check if on auth pages and redirect to dashboard
        const currentPage = window.location.pathname;
        if (currentPage.includes('login.html') || currentPage.includes('signup.html')) {
            window.location.href = 'dashboard.html';
        }
    }
}

// Get name from email for display
function getNameFromEmail(email) {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
}

// Logout function
function logout() {
    storage.remove('user');
    storage.remove('isLoggedIn');
    showNotification('Logged out successfully', 'info');
    window.location.href = 'index.html';
}

// Social media login handlers
function handleGoogleLogin() {
    showNotification('Google login will be implemented with backend integration', 'info');
}

function handleFacebookLogin() {
    showNotification('Facebook login will be implemented with backend integration', 'info');
}

// Password reset
function resetPassword(email) {
    if (!email || !utils.validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    showNotification('Password reset instructions sent to your email', 'success');
}

// Expose functions for global use
window.logout = logout;
window.handleGoogleLogin = handleGoogleLogin;
window.handleFacebookLogin = handleFacebookLogin;
window.resetPassword = resetPassword;
