/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				G20: {
					// Legacy keys (kept for backward compatibility)
					blue: "#17253f",
					darkGold: "#c39a41",
					lightGold: "#f0cf86",
					dark: "#0a0f1a",
					lightWight: "#f8f1e3",

					// Main landing theme tokens (solid navy + warm gold)
					pageBg: "#0a0f1a",
					headerBg: "#0f1728",
					surface: "#111c31",
					surfaceAlt: "#1b2842",
					border: "#29334a",
					titleText: "#f8f1e3",
					bodyText: "#c8d3e9",
					mutedText: "#b9c8e7",
					accent: "#d4b062",
					accentStrong: "#f0cf86",
				},

				// Optional: aliases so you can do text-gold-*, bg-gold-* if you prefer
				gold: {
					50: "#fff8e6",
					200: "#f2dca1",
					300: "#e9cd7f",
					400: "#d8b85e",
					500: "#c5a048",
					600: "#a68439",
				},
				GGP: {
					darkGold: '#cc9e35',
					lightGold: '#f0e783',
					dark: '#160807',
					lightWight: '#FAF5EC'
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
			/**
		 * ✅ These map the “inline background effects” you had into reusable utilities:
		 * - bg-radial-gold / bg-radial-white
		 * - shadow-goldGlow
		 */
			backgroundImage: {
				"radial-gold":
					"radial-gradient(circle_at_30%_20%, rgba(204,158,53,0.22), transparent 45%)",
				"radial-white":
					"radial-gradient(circle_at_70%_30%, rgba(255,255,255,0.06), transparent 45%)",
				"gold-soft":
					"radial-gradient(circle, rgba(204,158,53,0.22), transparent 60%)",
			},

			/**
			 * ✅ Shadow you used on the primary button
			 */
			boxShadow: {
				goldGlow: "0 14px 40px rgba(204,158,53,0.25)",
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
				// Optional: subtle float for crest / hero elements
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-6px)" },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
}

