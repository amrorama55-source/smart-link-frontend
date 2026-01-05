/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  safelist: [
    // Grid columns
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-3",
    "grid-cols-4",

    "md:grid-cols-1",
    "md:grid-cols-2",
    "md:grid-cols-3",
    "md:grid-cols-4",

    "lg:grid-cols-1",
    "lg:grid-cols-2",
    "lg:grid-cols-3",
    "lg:grid-cols-4",

    // Gaps
    "gap-2",
    "gap-4",
    "gap-6",
    "gap-8",

    // Max widths
    "max-w-sm",
    "max-w-md",
    "max-w-lg",
    "max-w-xl",
    "max-w-2xl",
    "max-w-4xl",
    "max-w-5xl",
    "max-w-6xl",
    "max-w-7xl",
    "max-w-full",
  ],

  theme: {
    extend: {
      screens: {
        xs: "475px",
      },

      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
    },
  },

  plugins: [],
};
