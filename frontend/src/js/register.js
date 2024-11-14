document.addEventListener('DOMContentLoaded', function () {
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const registerButton = document.getElementById('registerButton');
    const togglePassword1 = document.getElementById('togglePassword1');
    const toggleIcon1 = document.getElementById('toggleIcon1');
    const togglePassword2 = document.getElementById('togglePassword2');
    const toggleIcon2 = document.getElementById('toggleIcon2');

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
            nameField.value.trim() !== '' &&
            emailField.value.trim() !== '' &&
            passwordField.value.trim() !== '' &&
            confirmPasswordField.value.trim() !== ''
        ) {
            registerButton.disabled = false;
            registerButton.classList.remove('cursor-not-allowed', 'bg-gray-400');
            registerButton.classList.add('bg-[#1CB5E0]');
        } else {
            registerButton.disabled = true;
            registerButton.classList.add('cursor-not-allowed', 'bg-gray-400');
            registerButton.classList.remove('bg-[#1CB5E0]');
        }
    }

    nameField.addEventListener('input', toggleRegisterButton);
    emailField.addEventListener('input', toggleRegisterButton);
    passwordField.addEventListener('input', toggleRegisterButton);
    confirmPasswordField.addEventListener('input', toggleRegisterButton);
});
