/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'tablet': '640px',
        // => @media (min-width: 640px) { ... }

        'laptop': '1024px',
        // => @media (min-width: 1024px) { ... }

        'desktop': '1620px',
        // => @media (min-width: 1280px) { ... }
      },
      gridColumn: {
        'span-1/4': 'span 0.4 / span 1',
      }
    },
  },
  plugins: [],
}

