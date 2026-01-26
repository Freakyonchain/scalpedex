import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ============================================
         COLORS - Deep Space Palette
         ============================================ */
      colors: {
        // Background layers
        background: {
          DEFAULT: "#050505",
          secondary: "#0a0a0a",
        },
        surface: {
          DEFAULT: "#121212",
          elevated: "#1a1a1a",
          hover: "#222222",
        },
        
        // Primary accent - Violet Électrique
        primary: {
          DEFAULT: "#7c3aed",
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        
        // Profit - Vert Cyberpunk
        profit: {
          DEFAULT: "#00ffa3",
          dark: "#00cc82",
          glow: "rgba(0, 255, 163, 0.4)",
        },
        
        // Loss - Rouge Alerte
        loss: {
          DEFAULT: "#ff3b5c",
          dark: "#cc2f4a",
          glow: "rgba(255, 59, 92, 0.4)",
        },
        
        // Warning
        warning: {
          DEFAULT: "#ffaa00",
          dark: "#cc8800",
        },
        
        // Text hierarchy
        text: {
          primary: "#ffffff",
          secondary: "#a1a1aa",
          muted: "#71717a",
          dim: "#52525b",
        },
        
        // Glass effects
        glass: {
          bg: "rgba(18, 18, 18, 0.7)",
          border: "rgba(255, 255, 255, 0.08)",
          "border-hover": "rgba(255, 255, 255, 0.15)",
        },
      },

      /* ============================================
         TYPOGRAPHY
         ============================================ */
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        'data-xl': ['2rem', { lineHeight: '1', letterSpacing: '0', fontWeight: '700' }],
        'data-lg': ['1.5rem', { lineHeight: '1', letterSpacing: '0', fontWeight: '600' }],
        'data-md': ['1.125rem', { lineHeight: '1', letterSpacing: '0', fontWeight: '600' }],
        'label': ['0.625rem', { lineHeight: '1', letterSpacing: '0.1em', fontWeight: '600' }],
      },

      /* ============================================
         SPACING & SIZING
         ============================================ */
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        'safe-bottom': 'env(safe-area-inset-bottom, 0)',
      },

      /* ============================================
         BORDER RADIUS
         ============================================ */
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
      },

      /* ============================================
         BOX SHADOWS - Glows & Elevation
         ============================================ */
      boxShadow: {
        'glass': '0 4px 16px rgba(0, 0, 0, 0.5)',
        'glass-lg': '0 8px 32px rgba(0, 0, 0, 0.6)',
        'glow-primary': '0 0 40px rgba(124, 58, 237, 0.5)',
        'glow-primary-sm': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-profit': '0 0 30px rgba(0, 255, 163, 0.4)',
        'glow-profit-sm': '0 0 15px rgba(0, 255, 163, 0.3)',
        'glow-loss': '0 0 30px rgba(255, 59, 92, 0.4)',
        'btn-primary': '0 4px 20px rgba(124, 58, 237, 0.4)',
        'btn-primary-hover': '0 6px 30px rgba(124, 58, 237, 0.5)',
        'btn-profit': '0 4px 20px rgba(0, 255, 163, 0.4)',
        'btn-profit-hover': '0 6px 30px rgba(0, 255, 163, 0.5)',
      },

      /* ============================================
         BACKDROP BLUR
         ============================================ */
      backdropBlur: {
        xs: '4px',
        '2xl': '40px',
        '3xl': '64px',
      },

      /* ============================================
         ANIMATIONS
         ============================================ */
      animation: {
        // Page transitions
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
        'slide-in-bottom': 'slideInBottom 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        
        // Continuous animations
        'pulse-profit': 'pulseProfit 2s ease-in-out infinite',
        'pulse-primary': 'pulsePrimary 2s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        
        // Data animations
        'ticker': 'ticker 30s linear infinite',
        'scan-line': 'scanLine 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        
        // Status
        'status-pulse': 'statusPulse 2s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInBottom: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseProfit: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 163, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 163, 0.6)' },
        },
        pulsePrimary: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.6)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scanLine: {
          '0%, 100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        statusPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.1)' },
        },
      },

      /* ============================================
         TRANSITION
         ============================================ */
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },
      
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      /* ============================================
         Z-INDEX SCALE
         ============================================ */
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      /* ============================================
         BACKGROUNDS
         ============================================ */
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': `
          radial-gradient(ellipse 80% 50% at 20% 40%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 60%, rgba(0, 255, 163, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse 50% 30% at 50% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%)
        `,
        'grid-tactical': `
          linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
        'shimmer': 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0) 100%)',
      },
      
      backgroundSize: {
        'grid': '40px 40px',
        'shimmer': '200% 100%',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for additional utilities
    function({ addUtilities }: { addUtilities: Function }) {
      const newUtilities = {
        '.text-shadow-glow-primary': {
          textShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
        },
        '.text-shadow-glow-profit': {
          textShadow: '0 0 15px rgba(0, 255, 163, 0.5)',
        },
        '.hide-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.mask-fade-right': {
          maskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
          '-webkit-mask-image': 'linear-gradient(to right, black 80%, transparent 100%)',
        },
        '.mask-fade-bottom': {
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          '-webkit-mask-image': 'linear-gradient(to bottom, black 80%, transparent 100%)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
} satisfies Config;

export default config;