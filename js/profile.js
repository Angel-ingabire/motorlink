const API_BASE_URL = 'http://localhost:8000';

document.addEventListener('DOMContentLoaded', initializeProfile);

async function initializeProfile() {
    try {
        // Check for token in both cookie and localStorage
        const token = getToken();
        
        if (!token) {
            redirectToLogin();
            return;
        }

        // Load profile data
        const profileData = await loadProfileData(token);
        updateProfileUI(profileData);

        // Load stats
        const stats = await loadStats(token);
        updateStatsUI(stats);

        // Initialize form submission
        initializeProfileForm();

    } catch (error) {
        console.error('Profile initialization failed:', error);
        showNotification('Failed to load profile data. Please try again.', 'error');
    }
}

function getToken() {
    // Try to get token from cookie first
    const cookieToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('access_token='))
        ?.split('=')[1];
    
    // Fallback to localStorage
    return cookieToken || localStorage.getItem('motorlink_auth_token');
}

async function loadProfileData(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/me/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (response.status === 401) {
            // Token expired - redirect to login
            clearAuthData();
            redirectToLogin();
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error loading profile:', error);
        throw error;
    }
}

function updateProfileUI(user) {
    // Update profile header 
    const headerName = document.querySelector('.bg-white.rounded-lg h1'); // Updated selector
    const headerEmail = document.querySelector('.bg-white.rounded-lg p.text-gray-600');
    
    if (headerName) headerName.textContent = user.full_name || 'User';
    if (headerEmail) headerEmail.textContent = user.email || '';

    // Update profile form
    const nameParts = (user.full_name || '').split(' ');
    document.getElementById('firstName').value = nameParts[0] || '';
    document.getElementById('lastName').value = nameParts.slice(1).join(' ') || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone_number || '';

    // Update profile image 
    const profileImg = document.querySelector('.bg-white.rounded-lg img.rounded-full');
    if (profileImg) {
        if (user.profile_image_url) {
            profileImg.src = user.profile_image_url;
        } else {
            // Generate avatar from initials
            const initials = (user.full_name || 'US').split(' ')
                .map(n => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();
            profileImg.src = `https://ui-avatars.com/api/?name=${initials}&background=random`;
        }
    }

    // Update member since date 
    const memberSince = document.querySelector('.bg-white.rounded-lg p.text-gray-500');
    if (memberSince && user.created_at) {
        const date = new Date(user.created_at);
        memberSince.textContent = `Member since ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    }
}

async function loadStats(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/stats/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load stats');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error loading stats:', error);
        return {};
    }
}

function updateStatsUI(stats) {
    const statsContainer = document.querySelector('.account-summary');
    if (!statsContainer) return;
    
    const elements = {
        totalRides: statsContainer.querySelector('.stat-total-rides'),
        totalSpent: statsContainer.querySelector('.stat-total-spent'),
        avgRating: statsContainer.querySelector('.stat-avg-rating'),
        favoriteRoute: statsContainer.querySelector('.stat-favorite-route')
    };
    
    if (elements.totalRides) elements.totalRides.textContent = stats.total_rides || 0;
    if (elements.totalSpent) elements.totalSpent.textContent = `RWF ${(stats.total_spent || 0).toLocaleString()}`;
    if (elements.avgRating) elements.avgRating.textContent = (stats.avg_rating || 0).toFixed(1);
    if (elements.favoriteRoute) elements.favoriteRoute.textContent = stats.favorite_route || 'N/A';
}

function initializeProfileForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    const editProfileBtn = document.getElementById('editProfileBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const profileActions = document.getElementById('profileActions');
    const formInputs = form.querySelectorAll('input');

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            formInputs.forEach(input => {
                if (input.id !== 'email') { // Keep email readonly
                    input.disabled = false;
                }
            });
            editProfileBtn.style.display = 'none';
            profileActions.classList.remove('hidden');
        });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            formInputs.forEach(input => {
                input.disabled = true;
            });
            editProfileBtn.style.display = 'block';
            profileActions.classList.add('hidden');
            form.reset();
        });
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        try {
            submitButton.disabled = true;
            submitButton.innerHTML = 'Saving...';

            const formData = {
                full_name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`.trim(),
                phone_number: document.getElementById('phone').value,
                // Add other fields as needed
            };

            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/users/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            showNotification('Profile updated successfully!', 'success');

            // Disable form fields again
            formInputs.forEach(input => {
                input.disabled = true;
            });
            editProfileBtn.style.display = 'block';
            profileActions.classList.add('hidden');

        } catch (error) {
            showNotification(error.message || 'Failed to update profile', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
}

function clearAuthData() {
    localStorage.removeItem('motorlink_auth_token');
    localStorage.removeItem('motorlink_current_user');
    document.cookie = 'access_token=; Max-Age=0; path=/;';
}

function redirectToLogin() {
    window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
}

function showNotification(message, type = 'error') {
    // Implement your notification system
    alert(`${type.toUpperCase()}: ${message}`);
}