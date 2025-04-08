const colors = {
  primary: {
    100: "#D4DBFF",
    300: "#8698FD",
    500: "#3A58FF",
    700: "#0B26BA",
    900: "#0A1863",
  },
  white: "#FFFFFF",
  grey: "#A5A5A5",
};

const sizes = {
  l: "24px",
  m: "12px",
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
      spacing: {
        ...sizes,
      },
      borderRadius: {
        ...sizes,
      },
      height: {
        ...sizes,
      },
      width: {
        ...sizes,
      },
      minHeight: {
        ...sizes,
      },
      minWidth: {
        ...sizes,
      },
    },
  },
  plugins: [],
};
