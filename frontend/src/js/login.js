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
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                window.location.href = 'roadmap.html';
            } else if (data.status === 'error') {
                errorMessageContainer.textContent = data.message;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessageContainer.textContent = 'An unexpected error occurred. Please try again later.';
        });
    });
});