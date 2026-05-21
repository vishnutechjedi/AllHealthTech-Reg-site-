/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        frost: {
          ice: '#FAF3FF',
          frost: '#EDE8FF',
          mist: '#D6CFFF',
          warm: '#FFFEF9',
          navy: '#000E7A',
          abyss: '#00084A',
          core: '#0023FD',
          deep: '#0019C4',
          bridge: '#6B7FE8',
          magenta: '#EB42FA',
        },
        // Legacy aliases mapped to Frost & Navy
        brand: {
          50: '#FAF3FF',
          100: '#EDE8FF',
          200: '#D6CFFF',
          500: '#0023FD',
          600: '#0019C4',
          700: '#000E7A',
          900: '#00084A',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        primary: ['"DM Serif Display"', 'Georgia', 'serif'],
        secondary: ['"DM Sans"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
        pill: '100px',
      },
      boxShadow: {
        card: '0 18px 50px rgba(0, 14, 122, 0.08)',
      },
      transitionDuration: {
        'eventor-fast': '150ms',
        'eventor-normal': '300ms',
        'eventor-slow': '500ms',
      },
    },
  },
  plugins: [],
}
