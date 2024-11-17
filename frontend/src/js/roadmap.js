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

let selectedLevelUrl = '';

// Function to open the popup and set level URL
function openPopup(levelUrl) {
    selectedLevelUrl = levelUrl;
    document.getElementById('popupModal').classList.remove('hidden');
    document.getElementById('popupModal').classList.add('flex');
}

// Function to close the popup
function closePopup() {
    selectedLevelUrl = '';
    document.getElementById('popupModal').classList.add('hidden');
    document.getElementById('popupModal').classList.remove('flex');
}

// Close popup if clicking outside of it
window.addEventListener('click', function (event) {
    const popupModal = document.getElementById('popupModal');
    if (event.target === popupModal) {
        closePopup();
    }
});


async function getCompletedLevelsCount() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No access token found');
        return 0;
    }

    try {
        const response = await fetch('https://calculab-backend.up.railway.app/api/accounts/profile/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        return data.completed_levels ? data.completed_levels.length : 0;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return 0;
    }
}

function scrollToLevel(levelNumber) {
    const levelButton = document.querySelector(`button[onclick="openPopup('level${levelNumber}.html')"]`);
    if (levelButton) {
        levelButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Fungsi untuk mengupdate tampilan level berdasarkan jumlah level yang diselesaikan
async function updateLevelAccess() {
    const completedLevelsCount = await getCompletedLevelsCount();

    // Daftar elemen tombol level dan garis penghubungnya
    const stages = [
        { button: document.querySelector('button[onclick="openPopup(\'level1.html\')"]'), line: document.getElementById('stage1-line') },
        { button: document.querySelector('button[onclick="openPopup(\'level2.html\')"]'), line: document.getElementById('stage2-line') },
        { button: document.querySelector('button[onclick="openPopup(\'level3.html\')"]'), line: document.getElementById('stage3-line') }
    ];

    // Perulangan untuk mengubah properti tombol dan garis penghubung
    stages.forEach((stage, index) => {
        if (index <= completedLevelsCount) {
            // Level sudah diselesaikan atau dapat diakses
            stage.button.disabled = false;
            stage.button.classList.remove('bg-gray-500', 'cursor-not-allowed', 'opacity-70');
            stage.button.classList.add('bg-[#DC1F84]', 'cursor-pointer', 'hover:bg-[#a3125b]', 'active:bg-[#831048]');
            stage.line.classList.replace('bg-gray-500', 'bg-[#DC1F84]');
        } else {
            // Level belum bisa diakses
            stage.button.disabled = true;
            stage.button.classList.add('bg-gray-500', 'cursor-not-allowed', 'opacity-70');
            stage.button.classList.remove('bg-[#DC1F84]', 'cursor-pointer', 'hover:bg-[#a3125b]', 'active:bg-[#831048]');
            stage.line.classList.replace('bg-[#DC1F84]', 'bg-gray-500');
        }
    });

    // Khusus untuk line level 4
    const stage4Line = document.getElementById('stage4-line');
    if (completedLevelsCount >= 3) {
        stage4Line.classList.replace('bg-gray-500', 'bg-[#DC1F84]');
    } else {
        stage4Line.classList.replace('bg-[#DC1F84]', 'bg-gray-500');
    }

    // Ngescroll ke level yang harus diselesaikan
    if (completedLevelsCount < 3) {
        scrollToLevel(completedLevelsCount + 1);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const token = await ensureValidAccessToken();

    if (!token) {
        window.location.href = 'login.html'; // Redirect jika tidak ada token
        return;
    }

    await updateLevelAccess();

    const playButton = document.getElementById('playButton');
    if (playButton) {
        playButton.addEventListener('click', function () {
            window.location.href = selectedLevelUrl;
        });
    } else {
        console.error("Element with id 'playButton' not found.");
    }

    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', function (event) {
            event.preventDefault();
            
            // Hapus token dari localStorage
            localStorage.removeItem('token');

            // Redirect ke halaman landing page
            window.location.href = 'index.html';
        });
    }
});