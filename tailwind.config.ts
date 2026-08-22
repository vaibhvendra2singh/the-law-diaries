// eslint-disable-next-line @typescript-eslint/no-explicit-any
const config: any = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './posts/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-source-serif)', 'Georgia', 'serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'liberation mono', 'courier new', 'monospace'],
      },

      colors: {
        // Newsprint / warm paper background
        canvas: '#F9F7F2',
        // Printed ink text
        ink: '#141414',
        // Muted gray for rules & meta
        muted: '#6B685E',
        // Accent: Deep charcoal ink / black
        accent: {
          DEFAULT: '#141414',
          hover:   '#333333',
          light:   '#EFECE6',
        },
        // Paper divider line
        border: '#E2DED4',
      },

      fontSize: {
        'reading': ['1.125rem', { lineHeight: '1.85' }],
        'display-lg': ['3.75rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display': ['2.75rem', { lineHeight: '1.12', letterSpacing: '-0.01em' }],
        'mono-meta': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.15em' }],
      },

      maxWidth: {
        'prose': '680px',
        'site':  '960px',
        'wide':  '1120px',
      },

      spacing: {
        'section': '5rem',
      },
    },
  },

  plugins: [],
};

export default config;
