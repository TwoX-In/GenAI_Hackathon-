/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
    scrollbar: {
        DEFAULT: {
          width: '24px',
          height: '24px',
        },
      },
  }
  },
  plugins: [require("tailwind-scrollbar")],
};
