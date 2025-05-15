/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        primary: "#4C459D", // Blue
        accent: "#3ECFE0", // Purple
        secondary: "#64748B", // Slate
        background: "#D9D9D9", // Light gray
        surface: "#FFFFFF", // White
        muted: "#94A3B8", // Muted gray
        info: "#0EA5E9", // Sky blue
        success: "#22C55E", // Green
        danger: "#EF4444", // Red
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
