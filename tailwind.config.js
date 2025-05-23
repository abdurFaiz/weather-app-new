/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "#ffffff",
        "secondary-color": "#efefef",
        "aceent-color": "#35C1F1",
        "another-accent": "#0078D4",
        "gradient-eccent": "#f0f8ff",
        "text-color": "#3d3d3d",
        "hover-color": "#292929",
      },
    },
    fontFamily: {
      Roboto: ["Roboto, sans-serif"],
    },
    container: {
      padding: "2rem",
      center: true,
    },
  },
  plugins: [require("daisyui")],
};
