/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontSize: {
      'heading-1': [
        '50px',

        {
          marginTop: '0',
          marginBottom: '10',
          lineHeight: '1.2',
          fontWeight: '700',
        },
      ],
      'subheading-1': [
        '22px',
        {
          marginTop: '0',
          marginBottom: '8px',
          lineHeight: '1.4',
          fontWeight: '500',
        },
      ],
      'subheading-2': [
        '18px',
        {
          marginTop: '0',
          marginBottom: '8px',
          lineHeight: '1.4',
          fontWeight: '700',
        },
      ],

      text: [
        '16px',
        {
          lineHeight: '100%',
        },
      ],
      boldText: [
        '16px',
        {
          lineHeight: '100%',
          fontWeight: '700',
        },
      ],
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto)'],
        serif: ['var(--font-merriweather)'],
      },
      colors: {
        'black-1': '#333132',
        'white-1': '#fff',
        'grey-1': '#d9d9d9',
        'grey-2': '#f1f1f1',
        // 'grey-2': '#F8F8F8',
        'grey-3': '#6b7280',
        'purple-1': '#8e49ff',
        'purple-2': '#f9f6ff',
        'purple-3': '#7a3fdb',
        'purple-4': '#d8b4fe',
        'green-1': '#38c173',
        'green-2': '#8bc34a',
        'orange-1': '#ff9500',
        'blue-1': '#2998ff',
        'red-1': '#f26072',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.button-primary': {
          paddingTop: '0.8rem',
          paddingRight: '0.8rem',
          paddingBottom: '0.8rem',
          paddingLeft: '0.8rem',
          backgroundColor: '#8e49ff',
          color: '#fff',
          fontWeight: '500',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#8e49ff',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyItems: 'center',
          lineHeight: '1px',
          height: 'fit-content',
          // maxHeight: '40px',
        },
        '.button-primary:hover': {
          backgroundColor: '#7a3fdb',
        },

        '.button-secondary': {
          paddingTop: '0.8rem',
          paddingRight: '0.8rem',
          paddingBottom: '0.8rem',
          paddingLeft: '0.8rem',
          paddingLeft: '1rem',

          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#DADBDD',
          backgroundColor: '#fff',
          color: '#333132',
          fontWeight: '500',

          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyItems: 'center',
          lineHeight: '1px',
          height: 'fit-content',
        },
        '.button-secondary:hover': {
          backgroundColor: '#f9f6ff',
        },
        '.button-tertiary': {
          paddingTop: '1.3rem',
          paddingRight: '1rem',
          paddingBottom: '1.3rem',
          paddingLeft: '1rem',
          backgroundColor: '#fff',
          color: '#8e49ff',
          fontWeight: '500',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#8e49ff',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyItems: 'center',
          lineHeight: '1px',
          height: 'fit-content',
        },
        '.button-tertiary:hover': {
          backgroundColor: '#f9f6ff',
        },
        '.decline-button': {
          paddingTop: '1.3rem',
          paddingRight: '1rem',
          paddingBottom: '1.3rem',
          paddingLeft: '1rem',
          backgroundColor: '#f23f3f',
          color: '#fff',
          fontWeight: '500',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#DADBDD',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyItems: 'center',
          lineHeight: '1px',
          height: 'fit-content',
        },
        '.decline-button:hover': {
          backgroundColor: '#ee1010',
        },

        '.plain-button-1': {
          paddingTop: '1.1rem',
          paddingRight: '1rem',
          paddingBottom: '1.1rem',
          paddingLeft: '1rem',
          backgroundColor: '#8e49ff',
          color: '#fff',
          fontWeight: '500',
          // borderWidth: '1px',
          // borderStyle: 'solid',
          // borderColor: '#8e49ff',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyItems: 'center',
          lineHeight: '1px',
          height: 'fit-content',
          // maxHeight: '40px',
        },
        '.plain-button-1:hover': {
          backgroundColor: '#7a3fdb',
        },

        '.plain-button-2': {
          paddingTop: '1.1rem',
          paddingRight: '1rem',
          paddingBottom: '1.1rem',
          paddingLeft: '1rem',
          paddingLeft: '1rem',

          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#DADBDD',
          backgroundColor: '#fff',
          color: '#333132',
          fontWeight: '500',

          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyItems: 'center',
          lineHeight: '1px',
          height: 'fit-content',
        },
        '.plain-button-2:hover': {
          backgroundColor: '#f9f6ff',
        },
      };

      addUtilities(newUtilities);
    },
  ],
};
