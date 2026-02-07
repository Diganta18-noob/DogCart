/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                'dark-teal': '#0d1f2d',
                'teal-mid': '#1a3a4a',
            },
            fontFamily: {
                'outfit': ['Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
