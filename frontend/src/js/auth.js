function checkAuthForProtectedPages() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    } else if (isTokenExpiringSoon(token)) {
        // Jika token hampir habis, coba perbarui token
        refreshAccessToken().catch(() => {
            // Jika refresh gagal, arahkan ke halaman login
            window.location.href = 'login.html';
        });
    }
}

function checkAuthForPublicPages() {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpiringSoon(token)) {
        window.location.href = 'roadmap.html'; // Atau halaman utama yang sesuai
    }
}

// Fungsi untuk mendapatkan payload dari JWT
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error parsing JWT:', e);
        return null;
    }
}

// Fungsi untuk memeriksa apakah access token hampir kedaluwarsa
function isTokenExpiringSoon(token, bufferInSeconds = 120) {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) {
        return true; // Jika token tidak valid, anggap kadaluwarsa
    }
    const expirationTime = payload.exp * 1000; // Konversi ke milidetik
    const currentTime = Date.now();
    return expirationTime - currentTime < bufferInSeconds * 1000;
}

// Fungsi untuk melakukan refresh token
// function refreshAccessToken() {
//     const refreshToken = localStorage.getItem('refresh_token');
//     if (!refreshToken) {
//         console.error('No refresh token found');
//         return Promise.reject('No refresh token found');
//     }

//     return fetch('http://localhost:5000/api/token/refresh/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ refresh: refreshToken }),
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Failed to refresh access token');
//         }
//         return response.json();
//     })
//     .then(data => {
//         if (data.access) {
//             localStorage.setItem('token', data.access);
//             console.log('Access token berhasil diperbarui');
//             return data.access;
//         } else {
//             console.error('Gagal memperbarui access token');
//             return Promise.reject('Gagal memperbarui access token');
//         }
//     })
//     .catch(error => {
//         console.error('Error refreshing access token:', error);
//         // Optionally, redirect to login page if refreshing fails
//         window.location.href = 'login.html';
//         return Promise.reject(error);
//     });
// }

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    console.log('Refresh token:', refreshToken);
    if (!refreshToken) {
        console.error('No refresh token found');
        window.location.href = 'login.html';
        return null;
    }

    try {
        const response = await fetch('http://localhost:5000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });
        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }
        const data = await response.json();
        localStorage.setItem('token', data.access);
        console.log('Access token refreshed successfully');
        return data.access;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        window.location.href = 'login.html'; // Redirect ke halaman login jika refresh gagal
        return null;
    }
}

// Fungsi untuk memastikan access token diperbarui sebelum melakukan request
async function ensureValidAccessToken() {
    let token = localStorage.getItem('token');
    console.log('Current access token:', token);
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        console.error('No refresh token found, redirecting to login');
        window.location.href = 'login.html';
        return null;
    }
    
    if (token && isTokenExpiringSoon(token)) {
        console.log('Access token is expiring soon, refreshing...');
        token = await refreshAccessToken();
    }
    console.log('Access token after refresh:', token);
    return token;
}

// Contoh cara menggunakan fungsi ensureValidAccessToken sebelum permintaan API
async function fetchData() {
    const token = await ensureValidAccessToken();
    if (!token) return; // Handle if token is not available

    fetch('http://localhost:5000/api/accounts/profile/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Profile data:', data);
        // Lakukan sesuatu dengan data
    })
    .catch(error => {
        console.error('Error fetching profile data:', error);
    });
}


function logToServer(level, message) {
    fetch('http://localhost:5000/api/log-frontend/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level, message }),
    }).catch((error) => {
        console.error('Failed to log to server:', error);
    });
}