/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "0px", // Small screens (default)
      md: "768px", // Medium screens (default)
      lg: "1024px", // Large screens (default)
      xl: "1280px", // Extra large screens (default)
      "2xl": "1536px", // 2x Extra large screens (default)
      // Custom breakpoints
      tablet: "900px", // Example custom breakpoint
      desktop: "1440px", // Another custom breakpoint
    },
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "30%": { opacity: "0.3" },
          "60%": { opacity: "0.6" },
          "100%": { opacity: "1" },
        },
        appearanceIn: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "50%": { opacity: "0.5", transform: "translateY(15px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out", // Smoother fade-in
        appearanceIn: "appearanceIn 0.5s ease-in-out", // Slide-in and fade effect
      },
    },
  },
  plugins: [],
};
