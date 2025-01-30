/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'espresso': '#3d2c04',      /* all other text */ 
        'dark-cherry': '#47000e',   /* error text, error button outline */
        'beige': '#f8f3e6',         /* website whitespace */ 
        'mustard': '#bd912987',     /* navigation bar, buttons, etc. */ 
        'tawny-brown': '#755509',   /* container and button outlines */
        'cream': '#fffdf7',         /* forms */ 
        'light-rose': '#d775895e',  /* error and buttons */ 
        'clay': '#ca8236'           /* button outlines while hovering */
      },
      fontFamily: {
        header: ['Noto Serif'],     /* Headers, Titles, Larger Body Text */
        body: ['Noto Sans']         /* Small Body Text */       
      }
    },
  },
  plugins: [],
}

