/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#EF9F27",
        "accent-green": "#1D9E75",
        "accent-red": "#E5484D",
        "accent-blue": "#3B82F6",
        surface: "#111111",
        surface2: "#1a1a1a",
        surface3: "#222222",
        border: "rgba(255, 255, 255, 0.08)",
        "border-light": "rgba(255, 255, 255, 0.15)",
      },
      fontFamily: {
        heading: ["Syne", "sans-serif"],
        mono: ["DM Mono", "monospace"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        shimmer: "shimmer 2s infinite linear",
        "progress-fill": "progress-fill 0.6s ease-out forwards",
        "border-glow": "border-glow 2s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "progress-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--fill-width, 100%)" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(239, 159, 39, 0.3)" },
          "50%": { borderColor: "rgba(239, 159, 39, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};
