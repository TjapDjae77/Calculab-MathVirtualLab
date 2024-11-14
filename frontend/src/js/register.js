document.addEventListener('DOMContentLoaded', function () {
    const usernameField = document.getElementById('username');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const registerButton = document.getElementById('registerButton');
    const togglePassword1 = document.getElementById('togglePassword1');
    const toggleIcon1 = document.getElementById('toggleIcon1');
    const togglePassword2 = document.getElementById('togglePassword2');
    const toggleIcon2 = document.getElementById('toggleIcon2');
    const errorMessage = document.getElementById('errorMessage');

    // Buat nge-toggle visibility-nya password
    togglePassword1.addEventListener('click', function () {
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            toggleIcon1.src = '../../media/images/See.svg';
            toggleIcon1.alt = 'See Password Icon';
        } else {
            passwordField.type = 'password';
            toggleIcon1.src = '../../media/images/Hide.svg';
            toggleIcon1.alt = 'Hide Password Icon';
        }
    });

    togglePassword2.addEventListener('click', function () {
        if (confirmPasswordField.type === 'password') {
            confirmPasswordField.type = 'text';
            toggleIcon2.src = '../../media/images/See.svg';
            toggleIcon2.alt = 'See Password Icon';
        } else {
            confirmPasswordField.type = 'password';
            toggleIcon2.src = '../../media/images/Hide.svg';
            toggleIcon2.alt = 'Hide Password Icon';
        }
    });

    // Tombol sign-up cuma bisa diklik kalo semua fields udah keisi sesuatu
    function toggleRegisterButton() {
        if (
            usernameField.value.trim() !== '' &&
            emailField.value.trim() !== '' &&
            passwordField.value.trim() !== '' &&
            confirmPasswordField.value.trim() !== ''
        ) {
            registerButton.disabled = false;
            registerButton.classList.remove('cursor-not-allowed', 'bg-gray-400');
            registerButton.classList.add('bg-[#1CB5E0]', 'hover:bg-[#1693B6]');
            
        } else {
            registerButton.disabled = true;
            registerButton.classList.add('cursor-not-allowed', 'bg-gray-400');
            registerButton.classList.remove('bg-[#1CB5E0]', 'hover:bg-[#1693B6]');
        }
    }

    // Attach input event listeners to fields
    [usernameField, emailField, passwordField, confirmPasswordField].forEach(field => {
        field.addEventListener('input', toggleRegisterButton);
    });

    registerButton.addEventListener('click', function (event) {
        event.preventDefault();

        // Validate passwords
        if (passwordField.value !== confirmPasswordField.value) {
            errorMessage.innerHTML = "<p>Passwords do not match.</p>";
            return;
        }

        errorMessage.textContent = "";

        const username = usernameField.value;
        const email = emailField.value;
        const password = passwordField.value;

        fetch('http://localhost:5000/api/accounts/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, confirm_password: confirmPasswordField.value }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Redirect on successful registration
                window.location.href = 'login.html';
            } else if (data.status === 'error') {
                // Show error message
                errorMessage.innerHTML = "";
                if (data.errors) {
                    for (let key in data.errors) {
                        data.errors[key].forEach(error => {
                            errorMessage.innerHTML += `<p>${error}</p>`;
                        });
                    }
                } else {
                    errorMessage.innerHTML = "<p>Registration failed.</p>";
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.innerHTML = '<p>An error occurred during registration. Please try again.</p>';
        });
    });
});
