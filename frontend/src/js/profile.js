checkAuthForProtectedPages();

// Hide dropdown when clicking outside
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('moreDropdown');
    const moreButton = document.getElementById('moreButton');
    if (!moreButton.contains(event.target)) {
        dropdown.classList.add('hidden');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    

    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', function (event) {
            event.preventDefault();
            
            // Hapus token dari localStorage
            localStorage.removeItem('token');

            // Redirect ke halaman landing page
            window.location.href = 'landing_page.html';
        });
    }
});

// document.addEventListener('DOMContentLoaded', function () {
//     const profileInfo = document.getElementById('profile-info');
//     const usernameElement = document.getElementById('username');
//     const emailElement = document.getElementById('email');
//     const scoreElement = document.getElementById('score');
//     const levelCompletedElement = document.getElementById('level-completed');

//     const token = localStorage.getItem('token');
//     console.log("Token:", token);

//     fetch('http://localhost:5000/api/accounts/profile/', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`, // Menyertakan token JWT
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         } else if (response.status === 401) {
//             throw new Error("Unauthorized - Please log in again.");
//         } else {
//             throw new Error("An error occurred while fetching profile data.");
//         }
//     })
//     .then(data => {
//         console.log("Profile Data:", data);
//         usernameElement.textContent = data.username;
//         emailElement.textContent = data.email;
//         scoreElement.textContent = data.score;
//         levelCompletedElement.textContent = data.level_completed;
//     })
//     .catch(error => {
//         profileInfo.innerHTML = `<p class="text-red-500">${error.message}</p>`;
//         console.error("Error fetching profile:", error);
//     });
// });


function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');

    return fetch('http://localhost:5000/api/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh: refreshToken })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('token', data.access);
        return data.access;
    });
}

function fetchProfile() {
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/api/accounts/profile/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 401) {
            // Coba refresh token jika akses ditolak
            return refreshAccessToken().then(newToken => {
                return fetch('http://localhost:5000/api/accounts/profile/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${newToken}`,
                        'Content-Type': 'application/json'
                    }
                });
            });
        }
        return response;
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            // Update elemen HTML dengan data profil
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
            document.getElementById('score').textContent = data.score;
            document.getElementById('level-completed').textContent = data.level_completed;
        }
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
    });
}

document.addEventListener('DOMContentLoaded', fetchProfile);