/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'blue-light-key': '#41bfd0',
        'blue-dark-key': '#1e3d59',
        'green-light-key': '#60ceb0'
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-in-out',
        fadeOut: 'fadeOut 0.4s ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 }
        }
      }
    }
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none'
        },
        '.hide-scrollbar::-webkit-scrollbar': {
          display: 'none'
        }
      })
    }),
    require('vidstack/tailwind.cjs')({
      prefix: 'media',
      webComponents: true
    }),
    customVariants
  ]
}

function customVariants({ addVariant, matchVariant }) {
  // Strict version of `.group` to help with nesting.
  matchVariant('parent-data', (value) => `.parent[data-${value}] > &`)

  addVariant('hocus', ['&:hover', '&:focus-visible'])
  addVariant('group-hocus', ['.group:hover &', '.group:focus-visible &'])
}
