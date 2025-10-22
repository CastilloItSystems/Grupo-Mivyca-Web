/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores de empresa usando variables CSS
        company: {
          primary: "var(--company-primary)",
          secondary: "var(--company-secondary)",
          accent: "var(--company-accent)",
        },
        // Colores de tema usando variables CSS
        background: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        border: {
          primary: "var(--border-primary)",
          secondary: "var(--border-secondary)",
        },
        // Colores de estado
        status: {
          success: "var(--color-success)",
          warning: "var(--color-warning)",
          error: "var(--color-error)",
          info: "var(--color-info)",
        },
        // Colores principales del Grupo Mivyca
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
        // Colores por empresa (expandidos)
        almivyca: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        transmivyca: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        camabar: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
      backgroundImage: {
        "company-gradient": "var(--company-gradient)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "bounce-subtle": "bounceSubtle 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(-5%)" },
          "50%": { transform: "translateY(0)" },
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        company:
          "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "inner-company": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [
    // Plugin personalizado para utilidades dinámicas
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-company-primary": {
          color: "var(--company-primary)",
        },
        ".text-company-secondary": {
          color: "var(--company-secondary)",
        },
        ".text-company-accent": {
          color: "var(--company-accent)",
        },
        ".bg-company-primary": {
          backgroundColor: "var(--company-primary)",
        },
        ".bg-company-secondary": {
          backgroundColor: "var(--company-secondary)",
        },
        ".bg-company-accent": {
          backgroundColor: "var(--company-accent)",
        },
        ".border-company-primary": {
          borderColor: "var(--company-primary)",
        },
        ".border-company-secondary": {
          borderColor: "var(--company-secondary)",
        },
        ".border-company-accent": {
          borderColor: "var(--company-accent)",
        },
        ".hover\\:bg-company-primary:hover": {
          backgroundColor: "var(--company-primary)",
        },
        ".hover\\:bg-company-secondary:hover": {
          backgroundColor: "var(--company-secondary)",
        },
        ".focus\\:border-company-primary:focus": {
          borderColor: "var(--company-primary)",
        },
        ".focus\\:ring-company-primary:focus": {
          "--tw-ring-color": "var(--company-primary)",
        },
        // Utilidades para gradientes de empresa
        ".bg-company-gradient": {
          backgroundImage: "var(--company-gradient)",
        },
        // Utilidades para transiciones suaves
        ".transition-company": {
          transition:
            "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
        },
      };

      addUtilities(newUtilities);
    },
  ],
};
