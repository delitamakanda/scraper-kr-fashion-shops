/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
      require('daisyui')
  ],
  daisyui: {
    themes: ['light', 'dark'],
    colors: {
      primary: '#3F82ED',
      secondary: '#F53B58',
      success: '#4CD62B',
      info: '#3490FC',
      warning: '#FFC107',
      error: '#E91E63',
    },
  }
}

