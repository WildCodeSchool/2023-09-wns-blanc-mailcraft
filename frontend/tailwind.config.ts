import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        custom: '0 2px 2px rgba(0, 0, 0, 0.3)', // x=0, y=4, blur=4, color=rgba(0, 0, 0, 0.1)
      },
      colors: {
        customBrown: '#9F3D3D',
        customMellow: '#ffdbdb'
        
      },
      borderColor: {
        customBlack50: 'rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
export default config;
