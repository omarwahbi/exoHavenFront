/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
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
  		colors: {
  			brand: {
  				orange: {
  					50: '#FFF7ED',
  					100: '#FFEDD5',
  					200: '#FED7AA',
  					300: '#FDBA74',
  					400: '#FB923C',
  					500: '#F97316',
  					600: '#EA580C',
  					700: '#C2410C',
  					800: '#9A3412',
  					900: '#7C2D12',
  					DEFAULT: '#EA580C',
  				},
  				green: {
  					50: '#F0FDF4',
  					100: '#DCFCE7',
  					200: '#BBF7D0',
  					300: '#86EFAC',
  					400: '#4ADE80',
  					500: '#22C55E',
  					600: '#16A34A',
  					700: '#15803D',
  					800: '#166534',
  					900: '#14532D',
  					DEFAULT: '#15803D',
  				},
  				yellow: {
  					50: '#FEFCE8',
  					100: '#FEF9C3',
  					200: '#FEF08A',
  					300: '#FDE047',
  					400: '#FACC15',
  					500: '#EAB308',
  					600: '#CA8A04',
  					700: '#A16207',
  					800: '#854D0E',
  					900: '#713F12',
  					DEFAULT: '#FBBF24',
  				},
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
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.5s ease-out',
  			'scale-in': 'scaleIn 0.3s ease-out',
  			'slide-up': 'slideUp 0.5s ease-out',
  			'slide-down': 'slideDown 0.5s ease-out',
  			'blink': 'blink 1.5s ease-in-out infinite',
  			'spin': 'spin 1.5s linear infinite',
  			'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
  				'0%': { transform: 'translateY(10px)', opacity: '0' },
  				'100%': { transform: 'translateY(0)', opacity: '1' },
  			},
  			slideDown: {
  				'0%': { transform: 'translateY(-10px)', opacity: '0' },
  				'100%': { transform: 'translateY(0)', opacity: '1' },
  			},
  			blink: {
  				'0%, 100%': { opacity: '0' },
  				'50%': { opacity: '1' },
  			},
  			spin: {
  				'0%': { transform: 'rotate(0deg)' },
  				'100%': { transform: 'rotate(360deg)' },
  			},
  			pulse: {
  				'0%, 100%': { opacity: '1' },
  				'50%': { opacity: '.5' },
  			},
  		},
  		boxShadow: {
  			'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  			'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  			'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  			'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  			'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  			'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  			'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  			'card': '0 2px 8px rgba(43, 45, 42, 0.08)',
  			'card-hover': '0 8px 16px rgba(43, 45, 42, 0.12)',
  			'focus': '0 0 0 3px rgba(13, 76, 74, 0.3)',
  			'none': 'none',
  		},
  		borderRadius: {
  			'sm': '0.125rem',
  			'DEFAULT': '0.25rem',
  			'md': '0.375rem',
  			'lg': '0.5rem',
  			'xl': '0.75rem',
  			'2xl': '1rem',
  			'3xl': '1.5rem',
  			'full': '9999px',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
