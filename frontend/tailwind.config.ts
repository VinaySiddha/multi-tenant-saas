import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			// Official Sapru Brand 5-Color Palette
  			sapru: {
  				orange: '#FF6A3D',
  				'orange-hover': '#FF5522',
  				green: '#0F3D2E',
  				'green-dark': '#0A291F',
  				'green-light': '#165742',
  				bg: '#FAFAF8',
  				gray: '#E5E7EB',
  				charcoal: '#0B0B0B',
  				muted: '#6B7280',
  			},
  			brand: {
  				orange: '#FF6A3D',
  				green: '#0F3D2E',
  				bg: '#FAFAF8',
  				gray: '#E5E7EB',
  				border: '#E5E7EB',
  				text: '#0B0B0B',
  				charcoal: '#0B0B0B',
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: ['var(--font-poppins)', 'var(--font-manrope)', 'Poppins', 'sans-serif'],
  			poppins: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
  			manrope: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
  			mono: ['var(--font-manrope)', 'monospace'],
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
