/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'dark-teal': '#0d1f2d',
                'teal-mid': '#1a3a4a',
            },
            fontFamily: {
                'outfit': ['Outfit', 'sans-serif'],
                'inter': ['Inter', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-delay': 'float 6s ease-in-out 2s infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'fade-in': 'fadeIn 0.4s ease-out',
                'scale-in': 'scaleIn 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)' },
                    '50%': { boxShadow: '0 0 40px rgba(56, 189, 248, 0.4)' },
                },
                slideUp: {
                    from: { transform: 'translateY(30px)', opacity: '0' },
                    to: { transform: 'translateY(0)', opacity: '1' },
                },
                slideInRight: {
                    from: { transform: 'translateX(100%)', opacity: '0' },
                    to: { transform: 'translateX(0)', opacity: '1' },
                },
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                scaleIn: {
                    from: { transform: 'scale(0.9)', opacity: '0' },
                    to: { transform: 'scale(1)', opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: [
            {
                pawmart: {
                    "primary": "#6366f1",        // Indigo
                    "primary-content": "#ffffff",
                    "secondary": "#0ea5e9",       // Sky blue
                    "secondary-content": "#ffffff",
                    "accent": "#f59e0b",          // Amber
                    "accent-content": "#1a1a2e",
                    "neutral": "#1e293b",         // Slate 800
                    "neutral-content": "#cbd5e1",
                    "base-100": "#0f172a",        // Slate 900 — dark base
                    "base-200": "#1e293b",        // Slate 800
                    "base-300": "#334155",        // Slate 700
                    "base-content": "#e2e8f0",    // Slate 200
                    "info": "#38bdf8",            // Sky 400
                    "info-content": "#001a33",
                    "success": "#34d399",         // Emerald 400
                    "success-content": "#002a17",
                    "warning": "#fbbf24",         // Amber 400
                    "warning-content": "#1a1400",
                    "error": "#fb7185",           // Rose 400
                    "error-content": "#2a0010",
                    "--rounded-box": "1rem",
                    "--rounded-btn": "0.75rem",
                    "--rounded-badge": "1.9rem",
                    "--animation-btn": "0.25s",
                    "--animation-input": "0.2s",
                    "--btn-focus-scale": "0.97",
                    "--tab-radius": "0.7rem",
                },
            },
        ],
        darkTheme: "pawmart",
    },
}
