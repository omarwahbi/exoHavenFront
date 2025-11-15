const { green } = require("@mui/material/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			cairo: ['var(--font-cairo)', 'Arial', 'sans-serif'],
  			inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
  		},
  		fontSize: {
  			'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
  			'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
  			'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0.01em' }],
  			'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0' }],
  			'xl': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.01em' }],
  			'2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],
  			'3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
  			'4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
  			'5xl': ['3rem', { lineHeight: '1.16', letterSpacing: '-0.02em' }],
  			'6xl': ['3.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
  			'7xl': ['4.5rem', { lineHeight: '1.14', letterSpacing: '-0.03em' }],
  		},
  		colors: {
  			green1: '#E8F5E9',
  			green2: '#C8E6C9',
  			green3: '#81C784',
  			green4: '#4CAF50',
  			green5: '#2E7D32',
  			gray: {
  				50: '#F9FAFB',
  				100: '#F3F4F6',
  				200: '#E5E7EB',
  				300: '#D1D5DB',
  				400: '#9CA3AF',
  				500: '#6B7280',
  				600: '#4B5563',
  				700: '#374151',
  				800: '#1F2937',
  				900: '#111827',
  				950: '#030712',
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
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem',
  			'100': '25rem',
  			'112': '28rem',
  			'128': '32rem',
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  			'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(123, 40%, 85%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(122, 40%, 90%, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(124, 35%, 88%, 0.25) 0px, transparent 50%)',
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.4s ease-out',
  			'fade-in-slow': 'fadeIn 0.8s ease-out',
  			'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  			'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  			'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  			'slide-left': 'slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  			'slide-right': 'slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  			'bounce-gentle': 'bounceGentle 1s ease-in-out infinite',
  			'float': 'float 3s ease-in-out infinite',
  			'shimmer': 'shimmer 2s linear infinite',
  			'glow': 'glow 2s ease-in-out infinite alternate',
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': { opacity: '0' },
  				'100%': { opacity: '1' },
  			},
  			scaleIn: {
  				'0%': { transform: 'scale(0.95)', opacity: '0' },
  				'100%': { transform: 'scale(1)', opacity: '1' },
  			},
  			slideUp: {
  				'0%': { transform: 'translateY(20px)', opacity: '0' },
  				'100%': { transform: 'translateY(0)', opacity: '1' },
  			},
  			slideDown: {
  				'0%': { transform: 'translateY(-20px)', opacity: '0' },
  				'100%': { transform: 'translateY(0)', opacity: '1' },
  			},
  			slideLeft: {
  				'0%': { transform: 'translateX(20px)', opacity: '0' },
  				'100%': { transform: 'translateX(0)', opacity: '1' },
  			},
  			slideRight: {
  				'0%': { transform: 'translateX(-20px)', opacity: '0' },
  				'100%': { transform: 'translateX(0)', opacity: '1' },
  			},
  			bounceGentle: {
  				'0%, 100%': { transform: 'translateY(-5%)' },
  				'50%': { transform: 'translateY(0)' },
  			},
  			float: {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-10px)' },
  			},
  			shimmer: {
  				'0%': { backgroundPosition: '-1000px 0' },
  				'100%': { backgroundPosition: '1000px 0' },
  			},
  			glow: {
  				'0%': { boxShadow: '0 0 5px rgba(76, 175, 80, 0.2), 0 0 10px rgba(76, 175, 80, 0.1)' },
  				'100%': { boxShadow: '0 0 10px rgba(76, 175, 80, 0.4), 0 0 20px rgba(76, 175, 80, 0.2), 0 0 30px rgba(76, 175, 80, 0.1)' },
  			},
  		},
  		boxShadow: {
  			'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
  			'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
  			'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
  			'md': '0 8px 10px -2px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
  			'lg': '0 12px 16px -4px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
  			'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
  			'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
  			'3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.2)',
  			'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
  			'card': '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
  			'card-hover': '0 12px 24px -4px rgba(0, 0, 0, 0.08), 0 8px 16px -4px rgba(0, 0, 0, 0.04)',
  			'green': '0 4px 14px 0 rgba(76, 175, 80, 0.15)',
  			'green-lg': '0 8px 20px 0 rgba(76, 175, 80, 0.2)',
  			'focus': '0 0 0 3px rgba(76, 175, 80, 0.3)',
  			'none': 'none',
  		},
  		borderRadius: {
  			'sm': '0.375rem',
  			'DEFAULT': '0.5rem',
  			'md': '0.625rem',
  			'lg': '0.75rem',
  			'xl': '1rem',
  			'2xl': '1.25rem',
  			'3xl': '1.5rem',
  			'4xl': '2rem',
  			'full': '9999px',
  		},
  		backdropBlur: {
  			'xs': '2px',
  		},
  		transitionDuration: {
  			'400': '400ms',
  		},
  		transitionTimingFunction: {
  			'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
