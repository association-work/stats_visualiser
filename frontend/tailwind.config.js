const colors = {
  primary: {
    100: "#D4DBFF",
    300: "#8698FD",
    500: "#3A58FF",
    700: "#0B26BA",
    900: "#0A1863",
  },
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors,
      fontFamily: {
        base: ["Patrick Hand", "sans-serif"],
      },
      fontSize: {
        caption: "16px",
        body: "18px",
        bodyLg: "22px",
      },
    },
  },
  plugins: [],
};
