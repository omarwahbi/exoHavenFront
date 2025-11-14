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
  		colors: {
  			brand: {
  				teal: {
  					50: '#E8F5F4',
  					100: '#C2E5E3',
  					200: '#9AD5D1',
  					300: '#72C5BF',
  					400: '#4AB5AD',
  					500: '#0D4C4A',
  					600: '#0B403E',
  					700: '#093432',
  					800: '#072826',
  					900: '#051C1A',
  					DEFAULT: '#0D4C4A',
  				},
  				forest: {
  					50: '#E9F0ED',
  					100: '#C3D5CA',
  					200: '#9DBAA7',
  					300: '#779F84',
  					400: '#518461',
  					500: '#2C5F4A',
  					600: '#244F3D',
  					700: '#1C3F30',
  					800: '#142F23',
  					900: '#0C1F16',
  					DEFAULT: '#2C5F4A',
  				},
  				amber: {
  					50: '#FBF7F1',
  					100: '#F4E9D9',
  					200: '#EDDBC1',
  					300: '#E6CDA9',
  					400: '#DFBF91',
  					500: '#D4A574',
  					600: '#C89456',
  					700: '#B17D3F',
  					800: '#8A6131',
  					900: '#634523',
  					DEFAULT: '#D4A574',
  				},
  				clay: {
  					50: '#FBF0ED',
  					100: '#F4D4CC',
  					200: '#EDB8AB',
  					300: '#E69C8A',
  					400: '#DF8069',
  					500: '#B85C50',
  					600: '#9D4E43',
  					700: '#824036',
  					800: '#673229',
  					900: '#4C241C',
  					DEFAULT: '#B85C50',
  				},
  			},
  			neutral: {
  				50: '#FDFCFB',
  				100: '#F8F7F5',
  				200: '#EFEDEA',
  				300: '#E0DDD8',
  				400: '#C8C4BE',
  				500: '#9B9790',
  				600: '#6E6A64',
  				700: '#4F4C47',
  				800: '#393732',
  				900: '#2B2D2A',
  				DEFAULT: '#F8F7F5',
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
