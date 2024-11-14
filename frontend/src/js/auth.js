function checkAuthForProtectedPages() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

function checkAuthForPublicPages() {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'roadmap.html'; // Atau halaman lain yang sesuai
    }
}