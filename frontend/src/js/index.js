document.addEventListener('DOMContentLoaded', () => {
    const languageToggle = document.querySelector('.language-selector #language-toggle');
    const languageDropdown = document.querySelector('.language-selector .language-dropdown');

    languageToggle.addEventListener('click', () => {
        // Toggle the visibility of the dropdown
        if (languageDropdown.classList.contains('hidden')) {
            languageDropdown.classList.remove('hidden');
        } else {
            languageDropdown.classList.add('hidden');
        }
    });

    // Close the dropdown if clicked outside
    document.addEventListener('click', (event) => {
        if (!languageToggle.contains(event.target) && !languageDropdown.contains(event.target)) {
            languageDropdown.classList.add('hidden');
        }
    });
});
