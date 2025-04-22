
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				md: '2rem'
			},
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#6366f1', // Indigo color from Modernize
					foreground: '#ffffff'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: '#ffffff', // White sidebar like Modernize
					foreground: '#2a3547', // Dark text
					primary: '#6366f1', // Indigo for active items
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: '#f5f6fa', // Light accent background
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: '#f5f6fa', // Light border
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontSize: {
				// Adjusted for better mobile readability
				xs: ['0.75rem', { lineHeight: '1rem' }],
				sm: ['0.875rem', { lineHeight: '1.25rem' }],
				base: ['1rem', { lineHeight: '1.5rem' }],
				lg: ['1.125rem', { lineHeight: '1.75rem' }],
				xl: ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
			},
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			height: {
				screen: ['100vh', '100dvh'],
			},
			minHeight: {
				screen: ['100vh', '100dvh'],
			},
			maxHeight: {
				screen: ['100vh', '100dvh'],
			},
			boxShadow: {
				'card': '0 2px 8px rgba(0, 0, 0, 0.05)',
				'card-hover': '0 5px 15px rgba(0, 0, 0, 0.08)',
				'mobile-bottom': '0 -2px 10px rgba(0, 0, 0, 0.1)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'slide-in': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.2s ease-out',
				'fade-out': 'fade-out 0.2s ease-out',
				'slide-in': 'slide-in 0.3s ease-out'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }) {
			const newUtilities = {
				'.touch-manipulation': { 'touch-action': 'manipulation' },
				'.overscroll-none': { 'overscroll-behavior': 'none' },
				'.tap-highlight-none': { '-webkit-tap-highlight-color': 'transparent' },
				'.safe-top': { 'padding-top': 'env(safe-area-inset-top)' },
				'.safe-bottom': { 'padding-bottom': 'env(safe-area-inset-bottom)' },
				'.safe-left': { 'padding-left': 'env(safe-area-inset-left)' },
				'.safe-right': { 'padding-right': 'env(safe-area-inset-right)' },
			};
			addUtilities(newUtilities);
		}
	],
} satisfies Config;
