/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
            },
            colors: {
                offwhite: {
                    50: '#FDFDFC',
                    100: '#FAF9F5',
                    200: '#F4F3EE',
                    300: '#EBEAE3',
                    400: '#DFDED6',
                    500: '#D2D0C6',
                },
                canvas: '#F4F3EE',
                stage: '#FFFFFF',
                surface: '#FAF9F5',
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#0c261b',
                    950: '#061710',
                },
            },
            borderRadius: {
                '2xl': '1.25rem',
                '3xl': '1.75rem',
                '4xl': '2.25rem',
                '5xl': '2.75rem',
                '6xl': '3.25rem',
            },
            boxShadow: {
                'soft': '0 2px 12px -2px rgba(28, 41, 31, 0.04), 0 4px 6px -2px rgba(28, 41, 31, 0.02)',
                'card': '0 8px 30px -4px rgba(25, 42, 28, 0.05), 0 2px 6px -1px rgba(25, 42, 28, 0.03)',
                'card-hover': '0 20px 45px -8px rgba(25, 42, 28, 0.09), 0 6px 16px -3px rgba(25, 42, 28, 0.05)',
                'island': '0 20px 50px -12px rgba(20, 36, 24, 0.07), 0 6px 20px -4px rgba(20, 36, 24, 0.03)',
                'dock': '0 25px 60px -15px rgba(20, 36, 24, 0.12), 0 8px 25px -6px rgba(20, 36, 24, 0.05)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            },
        },
    },
    plugins: [],
}
