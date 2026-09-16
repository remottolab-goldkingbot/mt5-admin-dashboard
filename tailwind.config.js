export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#070a0f",
          surface: "#0b0f17",
          card: "#0f172a",
          border: "rgba(255, 255, 255, 0.08)",
          gold: "#d4af37",
          goldHover: "#f59e0b",
          blue: "#3b82f6",
          cyan: "#06b6d4",
          emerald: "#10b981",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
