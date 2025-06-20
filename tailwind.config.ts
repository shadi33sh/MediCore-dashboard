import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        Primary   : "#297c8f" ,
        Cyan  : "#81D2E4" ,
        Dark   : "#46707A" ,
        Orange  : "#CF7C32" ,
        Purble  : "#AE32CF" ,
        White  : "#E7F9FE" ,
        Gray  : "#7C8283" ,
        black :   '#07121f'
      },
      fontSize: {
        'h1': '2.25rem', // 36px
        'h2': '1.875rem', // 30px
        'h3': '1.5rem', // 24px
        'p': '1rem', // 16px
      }
    },
  },
  plugins: [],
} satisfies Config;
