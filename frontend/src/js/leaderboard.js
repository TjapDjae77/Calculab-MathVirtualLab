function checkAuthForProtectedPages() {
    const token = localStorage.getItem('token');
    console.log('Token found in checkAuthForProtectedPages:', token);
    logToServer('info', `Token found in checkAuthForProtectedPages: ${token}`)
    if (!token) {
        console.log('No token, redirecting to login.html');
        logToServer('info', 'Redirecting to login.html');
        window.location.href = 'login.html';
    }
}

checkAuthForProtectedPages();


document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No access token found');
        return;
    }

    try {
        // Memanggil API untuk mendapatkan data leaderboard
        const response = await fetch('https://calculab-backend.up.railway.app/api/leaderboard/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard data');
        }

        console.log("Berhasil ditemukan leaderboard")
        const leaderboardData = await response.json();
        
        const nameElements = document.querySelectorAll('.name_placeholder');
        const scoreElements = document.querySelectorAll('.score_placeholder');

        // Loop untuk mengisi data leaderboard, maksimal 10 elemen
        leaderboardData.slice(0, 10).forEach((player, index) => {
            if (nameElements[index] && scoreElements[index]) {
                nameElements[index].textContent = player.username || 'Anonymous'; 
                scoreElements[index].textContent = player.score || 0;
            }
        });
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
});
