module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1", // Indigo-500
          foreground: "#ffffff", // White text on primary
        },
        // Add more custom colors if needed
      },
    },
  },
  plugins: [],
}; 