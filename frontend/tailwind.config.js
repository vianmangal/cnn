export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      colors: {
        emotion: {
          angry: "#ef4444",
          fear: "#f59e0b",
          happy: "#22c55e",
          neutral: "#64748b",
          sad: "#3b82f6",
        },
      },
      backgroundImage: {
        "radial-glow": "radial-gradient(circle at top, rgba(59,130,246,0.15), transparent 60%)",
        grid: "linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(180deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
