checkAuthForPublicPages();
document.addEventListener('DOMContentLoaded', function () {
    
    const usernameField = document.getElementById('username_email');
    const passwordField = document.getElementById('password');
    const signInButton = document.getElementById('signInButton');
    const togglePassword = document.getElementById('togglePassword');
    const toggleIcon = document.getElementById('toggleIcon');
    const errorMessageContainer = document.createElement('div');
    errorMessageContainer.classList.add('text-red-500', 'text-sm', 'mt-2');
    passwordField.parentNode.insertBefore(errorMessageContainer, passwordField.nextSibling);

    // Buat nge-toggle visibility-nya password
    togglePassword.addEventListener('click', function () {
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            toggleIcon.src = '../../media/images/See.svg';
            toggleIcon.alt = 'See Password Icon';
        } else {
            passwordField.type = 'password';
            toggleIcon.src = '../../media/images/Hide.svg';
            toggleIcon.alt = 'Hide Password Icon';
        }
    });

    // Tombol sign-in cuma bisa diklik kalo username dan password udah keisi sesuatu dua-duanya
    function toggleSignInButton() {
        if (usernameField.value.trim() !== '' && passwordField.value.trim() !== '') {
            signInButton.disabled = false;
            signInButton.classList.remove('cursor-not-allowed', 'bg-gray-400');
            signInButton.classList.add('bg-[#1CB5E0]');
            signInButton.classList.add('hover:bg-[#1693B6]');
            
        } else {
            signInButton.disabled = true;
            signInButton.classList.add('cursor-not-allowed', 'bg-gray-400');
            signInButton.classList.remove('bg-[#1CB5E0]');
            signInButton.classList.remove('hover:bg-[#1693B6]');
        }
    }

    usernameField.addEventListener('input', toggleSignInButton);
    passwordField.addEventListener('input', toggleSignInButton);

    signInButton.addEventListener('click', function (event) {
        event.preventDefault();
        
        const username = usernameField.value;
        const password = passwordField.value;

        fetch('http://localhost:5000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: usernameField.value, password: passwordField.value }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error('Incorrect username or password');
                });
            }
            return response.json();
        })
        .then(data => {
            logToServer('info', `Response data: ${JSON.stringify(data)}`); // Tambahkan log ini
            if (data.status === 'success') {
                const token = data.data.token;
                const refreshToken = data.refresh;
                if (token && refreshToken) {
                    localStorage.setItem('token', token); // Access token
                    localStorage.setItem('refresh_token', refreshToken); // Refresh token
                    logToServer('info', 'Tokens saved successfully, redirecting to roadmap.html...');
                    window.location.href = 'roadmap.html';
                    logToServer('info', 'After setting window.location.href');
                } else {
                    logToServer('error', 'Missing tokens in response, staying on login page.');
                    errorMessageContainer.textContent = 'Login failed, please try again.';
                }
            } else if (data.status === 'error') {
                logToServer('error', `Login failed: ${data.message}`);
                errorMessageContainer.textContent = data.message;
            }
        })
        .catch(error => {
            logToServer('error', `Unexpected error: ${error.message}`);
            console.error('Error:', error);
            errorMessageContainer.textContent = error.message;
        });
    });
});
