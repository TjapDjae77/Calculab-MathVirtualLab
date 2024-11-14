/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to bottom, #000000 0%, #000046 40%, #1CB5E0 60%, #D8D8F6 80%)',
      },
    },
  },
  plugins: [],
}

