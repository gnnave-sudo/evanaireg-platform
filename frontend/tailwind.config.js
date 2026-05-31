/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0A0A0F',
        'near-black': '#0F0F14',
        'warm-amber': '#E8A838',
        'pale-gold': '#F5E6C8',
        'soft-cream': '#F0EDE6',
        'muted-sand': '#9B968B',
        'surface-dark': '#15151C',
        'surface-mid': '#1C1C26',
        'amber-glow': 'rgba(232, 168, 56, 0.15)',
        'amber-core': 'rgba(232, 168, 56, 0.08)',
        'subtle-line': 'rgba(240, 237, 230, 0.06)',
        'muted-sand-50': 'rgba(155, 150, 139, 0.5)',
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
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
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
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        display: ['120px', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-mobile': ['48px', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '700' }],
        h1: ['72px', { lineHeight: '1.0', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1-mobile': ['36px', { lineHeight: '1.0', letterSpacing: '-0.02em', fontWeight: '700' }],
        h2: ['48px', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '500' }],
        'h2-mobile': ['28px', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '500' }],
        h3: ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3-mobile': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['20px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '500' }],
        data: ['14px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        'section-desktop': '160px',
        'section-mobile': '80px',
        'content-max': '1280px',
        'container-pad': '48px',
        'container-pad-mobile': '20px',
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'amber-glow': '0 0 20px rgba(232,168,56,0.3)',
        'amber-glow-lg': '0 0 30px rgba(232,168,56,0.35)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "sound-bar": {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1.0)" },
        },
        "mascot-wave": {
          "0%": { transform: "rotate(0deg)" },
          "20%": { transform: "rotate(-10deg)" },
          "40%": { transform: "rotate(10deg)" },
          "60%": { transform: "rotate(-10deg)" },
          "80%": { transform: "rotate(5deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.1" },
          "50%": { opacity: "0.2" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "marquee": "marquee 20s linear infinite",
        "sound-bar": "sound-bar 1.2s ease-in-out infinite",
        "mascot-wave": "mascot-wave 600ms ease-in-out",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
