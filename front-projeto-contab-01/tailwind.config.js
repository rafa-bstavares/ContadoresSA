// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "servicos-pattern": "url('/pattern-servicos.svg')",
        "imoveis-pattern": "url('/pattern-imoveis.svg')",
      },
      backgroundSize: {
        pattern: "200px 200px",
      },
      backgroundColor: {
        fundoPreto: "#121212",
      },
    },
  },
  plugins: [],
};
