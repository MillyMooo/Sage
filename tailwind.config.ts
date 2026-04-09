import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Nunito', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          alt: "hsl(var(--card-alt))",
        },
        sage: {
          DEFAULT: "hsl(var(--sage))",
          soft: "hsl(var(--sage-soft))",
          deep: "hsl(var(--sage-deep))",
        },
        blush: {
          DEFAULT: "hsl(var(--blush))",
          soft: "hsl(var(--blush-soft))",
          deep: "hsl(var(--blush-deep))",
        },
        mint: "hsl(var(--mint))",
        "green-mid": "hsl(var(--green-mid))",
        "green-soft": "hsl(var(--green-soft))",
        "green-pale": "hsl(var(--green-pale))",
        "pink-mid": "hsl(var(--pink-mid))",
        "pink-soft": "hsl(var(--pink-soft))",
        "text-tertiary": "hsl(var(--text-tertiary))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        xl: "22px",
        lg: "16px",
        md: "12px",
        sm: "8px",
        pill: "100px",
      },
      boxShadow: {
        soft: "0 2px 12px rgba(45, 59, 45, 0.06)",
        card: "0 4px 20px rgba(45, 59, 45, 0.08)",
        "card-lg": "0 8px 32px rgba(45, 59, 45, 0.1)",
        btn: "0 4px 14px rgba(61, 107, 79, 0.25)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
