import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // START OF SHADCN
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // DESIGN SYSTEM COLORS
        beige: {
          500: "hsl(var(--beige-500))",
          100: "hsl(var(--beige-100))",
        },
        grey: {
          900: "hsl(var(--grey-900))",
          500: "hsl(var(--grey-500))",
          300: "hsl(var(--grey-300))",
          100: "hsl(var(--grey-100))",
        },
        green: "hsl(var(--green))",
        yellow: "hsl(var(--yellow))",
        cyan: "hsl(var(--cyan))",
        navy: "hsl(var(--navy))",
        red: "hsl(var(--red))",
        purple: "hsl(var(--purple))",
        pink: "hsl(var(--pink))",
        turquoise: "hsl(var(--turquoise))",
        brown: "hsl(var(--brown))",
        magenta: "hsl(var(--magenta))",
        blue: "hsl(var(--blue))",
        navygrey: "hsl(var(--navy-grey))",
        armygreen: "hsl(var(--army-green))",
        gold: "hsl(var(--gold))",
        orange: "hsl(var(--orange))",
        // END OF DESIGN SYSTEM COLORS

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      // end of shadcn
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
