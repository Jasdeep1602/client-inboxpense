const config = {
  plugins: {
    // OLD WAY: "tailwindcss": {},
    // NEW WAY: Use the dedicated package
    '@tailwindcss/postcss': {},

    // autoprefixer remains the same
    autoprefixer: {},
  },
};

export default config;
