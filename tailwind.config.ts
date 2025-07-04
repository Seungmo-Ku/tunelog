// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-quicksand)', 'sans-serif'],
            },
            fontSize: {
                'h1': [
                    '64px', {
                        fontWeight: 200,
                        lineHeight: '1.2'
                    }
                ],
                'h1-sm': [
                    '42px', {
                        fontWeight: 200,
                        lineHeight: '1.2'
                    }
                ],
                'h1-xs': [
                    '24px', {
                        fontWeight: 200,
                        lineHeight: '1.2'
                    }
                ],
                'h2': [
                    '64px', {
                        fontWeight: 600,
                        lineHeight: '1.2'
                    }
                ],
                'h2-sm': [
                    '42px', {
                        fontWeight: 600,
                        lineHeight: '1.2'
                    }
                ],
                'h2-xs': [
                    '24px', {
                        fontWeight: 600,
                        lineHeight: '1.2'
                    }
                ],
                'h3': [
                    '40px', {
                        fontWeight: 600,
                        lineHeight: '1.5'
                    }
                ],
                'h3-ul': [
                    '40px', {
                        fontWeight: 200,
                        lineHeight: '1.5'
                    }
                ],
                'h3-sm': [
                    '30px', {
                        fontWeight: 600,
                        lineHeight: '1.5'
                    }
                ],
                'h3-ul-sm': [
                    '30px', {
                        fontWeight: 200,
                        lineHeight: '1.5'
                    }
                ],
                'h3-xs': [
                    '23px', {
                        fontWeight: 600,
                        lineHeight: '1.5'
                    }
                ],
                'h3-ul-xs': [
                    '23px', {
                        fontWeight: 200,
                        lineHeight: '1.5'
                    }
                ],
                'h4': [
                    '30px', {
                        fontWeight: 600,
                        lineHeight: '1.5'
                    }
                ],
                'h5': [
                    '24px', {
                        fontWeight: 600,
                        lineHeight: '1.2'
                    }
                ],
                'h5-sm': [
                    '16px', {
                        fontWeight: 600,
                        lineHeight: '1.2'
                    }
                ],
                'h6': [
                    '22px', {
                        fontWeight: 600,
                        lineHeight: '1.2'
                    }
                ],
                'h6-sm': [
                    '14px', {
                        fontWeight: 600,
                        lineHeight: '1.2'
                    }
                ],
                'b1': [
                    '22px', {
                        fontWeight: 300,
                        lineHeight: '1.6'
                    }
                ],
                'b1-sm': [
                    '13px', {
                        fontWeight: 400,
                        lineHeight: '1.6'
                    }
                ],
                'b1-xs': [
                    '12px', {
                        fontWeight: 400,
                        lineHeight: '1.6'
                    }
                ],
                'b2': [
                    '20px', {
                        fontWeight: 400,
                        lineHeight: '1.6'
                    }
                ],
                'b2-sm': [
                    '13px', {
                        fontWeight: 400,
                        lineHeight: '1.6'
                    }
                ],
                'b2-xs': [
                    '12px', {
                        fontWeight: 400,
                        lineHeight: '1.6'
                    }
                ],
                'b3': [
                    '18px', {
                        fontWeight: 400,
                        lineHeight: '1.5'
                    }
                ],
                'b3-sm': [
                    '10px', {
                        fontWeight: 400,
                        lineHeight: '1.5'
                    }
                ],
                'b4': [
                    '16px', {
                        fontWeight: 400,
                        lineHeight: '1.5'
                    }
                ],
                'b4-sm': [
                    '12px', {
                        fontWeight: 400,
                        lineHeight: '1.5'
                    }
                ],
                'c1': [
                    '16px', {
                        fontWeight: 600,
                        lineHeight: '1.2'
                    }
                ],
                'c1-sm': [
                    '13px', {
                        fontWeight: 600,
                        lineHeight: '1.2'
                    }
                ],
                'c1-xs': [
                    '12px', {
                        fontWeight: 600,
                        lineHeight: '1.2'
                    }
                ],
                'c2': [
                    '13px', {
                        fontWeight: 600,
                        lineHeight: '1.6'
                    }
                ],
                'f1': [
                    '16px', {
                        fontWeight: 300
                    }
                ],
                'f2': [
                    '13px', {
                        fontWeight: 300
                    }
                ],
                'f2-sm': [
                    '10px', {
                        fontWeight: 300
                    }
                ],
                'f3': [
                    '16px', {
                        fontWeight: 400
                    }
                ],
                'f3-sm': [
                    '12px', {
                        fontWeight: 400
                    }
                ],
                'f3-xs': [
                    '10px', {
                        fontWeight: 400
                    }
                ],
                'btn1': [
                    '18px', {
                        fontWeight: 600
                    }
                ],
                'btn1-sm': [
                    '13px', {
                        fontWeight: 600
                    }
                ],
                'btn2': [
                    '14px', {
                        fontWeight: 600
                    }
                ],
                'btn3': [
                    '16px', {
                        fontWeight: 600
                    }
                ],
                'btn3-sm': [
                    '10px', {
                        fontWeight: 600
                    }
                ],
                'ft1': [
                    '12px', {
                        fontWeight: 400,
                        lineHeight: '1.8'
                    }
                ],
                'ft2': [
                    '14px', {
                        fontWeight: 600
                    }
                ],
                'ft3': [
                    '14px', {
                        fontWeight: 400,
                        lineHeight: '3.0'
                    }
                ],
                'card1': [
                    '20px', {
                        fontWeight: 600
                    }
                ],
                'card1-sm': [
                    '13px', {
                        fontWeight: 600
                    }
                ],
                'card2': [
                    '14px', {
                        fontWeight: 300
                    }
                ],
                'card2-sm': [
                    '10px', {
                        fontWeight: 300
                    }
                ],
                'q': [
                    '30px', {
                        fontWeight: 600
                    }
                ],
                'q-sm': [
                    '18px', {
                        fontWeight: 600
                    }
                ],
                'q-xs': [
                    '14px', {
                        fontWeight: 600
                    }
                ],
                '10-light': [
                    '0.625rem', {
                        fontWeight: '300',
                        lineHeight: '0.875rem'
                    }
                ],
                '10-regular': [
                    '0.625rem', {
                        fontWeight: '400',
                        lineHeight: '0.875rem'
                    }
                ],
                '10-medium': [
                    '0.625rem', {
                        fontWeight: '500',
                        lineHeight: '0.875rem'
                    }
                ],
                '10-semibold': [
                    '0.625rem', {
                        fontWeight: '600',
                        lineHeight: '0.875rem'
                    }
                ],
                '10-bold': [
                    '0.625rem', {
                        fontWeight: '700',
                        lineHeight: '0.875rem'
                    }
                ],
                '11-light': [
                    '0.688rem', {
                        fontWeight: '300',
                        lineHeight: '1rem'
                    }
                ],
                '11-regular': [
                    '0.688rem', {
                        fontWeight: '400',
                        lineHeight: '1rem'
                    }
                ],
                '11-medium': [
                    '0.688rem', {
                        fontWeight: '500',
                        lineHeight: '1rem'
                    }
                ],
                '11-semibold': [
                    '0.688rem', {
                        fontWeight: '600',
                        lineHeight: '1rem'
                    }
                ],
                '11-bold': [
                    '0.688rem', {
                        fontWeight: '700',
                        lineHeight: '1rem'
                    }
                ],
                '12-light': [
                    '0.75rem', {
                        fontWeight: '300',
                        lineHeight: '1rem'
                    }
                ],
                '12-regular': [
                    '0.75rem', {
                        fontWeight: '400',
                        lineHeight: '1rem'
                    }
                ],
                '12-medium': [
                    '0.75rem', {
                        fontWeight: '500',
                        lineHeight: '1rem'
                    }
                ],
                '12-semibold': [
                    '0.75rem', {
                        fontWeight: '600',
                        lineHeight: '1rem'
                    }
                ],
                '12-bold': [
                    '0.75rem', {
                        fontWeight: '700',
                        lineHeight: '1rem'
                    }
                ],
                '13-regular': [
                    '0.8125rem', {
                        fontWeight: '400',
                        lineHeight: '1.125rem'
                    }
                ],
                '13-medium': [
                    '0.8125rem', {
                        fontWeight: '500',
                        lineHeight: '1.125rem'
                    }
                ],
                '13-semibold': [
                    '0.8125rem', {
                        fontWeight: '600',
                        lineHeight: '1.125rem'
                    }
                ],
                '13-bold': [
                    '0.8125rem', {
                        fontWeight: '700',
                        lineHeight: '1.125rem'
                    }
                ],
                '14-light': [
                    '0.875rem', {
                        fontWeight: '300',
                        lineHeight: '1.25rem'
                    }
                ],
                '14-regular': [
                    '0.875rem', {
                        fontWeight: '400',
                        lineHeight: '1.25rem'
                    }
                ],
                '14-medium': [
                    '0.875rem', {
                        fontWeight: '500',
                        lineHeight: '1.25rem'
                    }
                ],
                '14-semibold': [
                    '0.875rem', {
                        fontWeight: '600',
                        lineHeight: '1.25rem'
                    }
                ],
                '14-bold': [
                    '0.875rem', {
                        fontWeight: '700',
                        lineHeight: '1.25rem'
                    }
                ],
                '15-regular': [
                    '0.9375rem', {
                        fontWeight: '400',
                        lineHeight: '1.375rem'
                    }
                ],
                '15-medium': [
                    '0.9375rem', {
                        fontWeight: '500',
                        lineHeight: '1.375rem'
                    }
                ],
                '15-semibold': [
                    '0.9375rem', {
                        fontWeight: '600',
                        lineHeight: '1.375rem'
                    }
                ],
                '15-bold': [
                    '0.9375rem', {
                        fontWeight: '700',
                        lineHeight: '1.375rem'
                    }
                ],
                '16-light': [
                    '1rem', {
                        fontWeight: '300',
                        lineHeight: '1.5rem'
                    }
                ],
                '16-regular': [
                    '1rem', {
                        fontWeight: '400',
                        lineHeight: '1.5rem'
                    }
                ],
                '16-medium': [
                    '1rem', {
                        fontWeight: '500',
                        lineHeight: '1.5rem'
                    }
                ],
                '16-semibold': [
                    '1rem', {
                        fontWeight: '600',
                        lineHeight: '1.5rem'
                    }
                ],
                '16-bold': [
                    '1rem', {
                        fontWeight: '700',
                        lineHeight: '1.5rem'
                    }
                ],
                '18-light': [
                    '1.125rem', {
                        fontWeight: '300',
                        lineHeight: '1.75rem'
                    }
                ],
                '18-regular': [
                    '1.125rem', {
                        fontWeight: '400',
                        lineHeight: '1.75rem'
                    }
                ],
                '18-medium': [
                    '1.125rem', {
                        fontWeight: '500',
                        lineHeight: '1.75rem'
                    }
                ],
                '18-semibold': [
                    '1.125rem', {
                        fontWeight: '600',
                        lineHeight: '1.75rem'
                    }
                ],
                '18-bold': [
                    '1.125rem', {
                        fontWeight: '700',
                        lineHeight: '1.75rem'
                    }
                ],
                '20-light': [
                    '1.25rem', {
                        fontWeight: '300',
                        lineHeight: '2rem'
                    }
                ],
                '20-regular': [
                    '1.25rem', {
                        fontWeight: '400',
                        lineHeight: '2rem'
                    }
                ],
                '20-medium': [
                    '1.25rem', {
                        fontWeight: '500',
                        lineHeight: '2rem'
                    }
                ],
                '20-semibold': [
                    '1.25rem', {
                        fontWeight: '600',
                        lineHeight: '2rem'
                    }
                ],
                '20-bold': [
                    '1.25rem', {
                        fontWeight: '700',
                        lineHeight: '2rem'
                    }
                ],
                '24-light': [
                    '1.5rem', {
                        fontWeight: '300',
                        lineHeight: '2.25rem'
                    }
                ],
                '24-regular': [
                    '1.5rem', {
                        fontWeight: '400',
                        lineHeight: '2.25rem'
                    }
                ],
                '24-medium': [
                    '1.5rem', {
                        fontWeight: '500',
                        lineHeight: '2.25rem'
                    }
                ],
                '24-semibold': [
                    '1.5rem', {
                        fontWeight: '600',
                        lineHeight: '2.25rem'
                    }
                ],
                '24-bold': [
                    '1.5rem', {
                        fontWeight: '700',
                        lineHeight: '2.25rem'
                    }
                ],
                '28-light': [
                    '1.75rem', {
                        fontWeight: '300',
                        lineHeight: '2.5rem'
                    }
                ],
                '28-regular': [
                    '1.75rem', {
                        fontWeight: '400',
                        lineHeight: '2.5rem'
                    }
                ],
                '28-medium': [
                    '1.75rem', {
                        fontWeight: '500',
                        lineHeight: '2.5rem'
                    }
                ],
                '28-semibold': [
                    '1.75rem', {
                        fontWeight: '600',
                        lineHeight: '2.5rem'
                    }
                ],
                '28-bold': [
                    '1.75rem', {
                        fontWeight: '700',
                        lineHeight: '2.5rem'
                    }
                ],
                '30-light': [
                    '1.875rem', {
                        fontWeight: '300',
                        lineHeight: '2.75rem'
                    }
                ],
                '30-regular': [
                    '1.875rem', {
                        fontWeight: '400',
                        lineHeight: '2.75rem'
                    }
                ],
                '30-medium': [
                    '1.875rem', {
                        fontWeight: '500',
                        lineHeight: '2.75rem'
                    }
                ],
                '30-semibold': [
                    '1.875rem', {
                        fontWeight: '600',
                        lineHeight: '2.75rem'
                    }
                ],
                '30-bold': [
                    '1.875rem', {
                        fontWeight: '700',
                        lineHeight: '2.75rem'
                    }
                ],
                '36-light': [
                    '2.25rem', {
                        fontWeight: '300',
                        lineHeight: '3.25rem'
                    }
                ],
                '36-regular': [
                    '2.25rem', {
                        fontWeight: '400',
                        lineHeight: '3.25rem'
                    }
                ],
                '36-medium': [
                    '2.25rem', {
                        fontWeight: '500',
                        lineHeight: '3.25rem'
                    }
                ],
                '36-semibold': [
                    '2.25rem', {
                        fontWeight: '600',
                        lineHeight: '3.25rem'
                    }
                ],
                '36-bold': [
                    '2.25rem', {
                        fontWeight: '700',
                        lineHeight: '3.25rem'
                    }
                ],
                '40-light': [
                    '2.5rem', {
                        fontWeight: '300',
                        lineHeight: '3.75rem'
                    }
                ],
                '40-regular': [
                    '2.5rem', {
                        fontWeight: '400',
                        lineHeight: '3.75rem'
                    }
                ],
                '40-medium': [
                    '2.5rem', {
                        fontWeight: '500',
                        lineHeight: '3.75rem'
                    }
                ],
                '40-semibold': [
                    '2.5rem', {
                        fontWeight: '600',
                        lineHeight: '3.5rem'
                    }
                ],
                '40-bold': [
                    '2.5rem', {
                        fontWeight: '700',
                        lineHeight: '3.75rem'
                    }
                ],
                '44-light': [
                    '2.75rem', {
                        fontWeight: '300',
                        lineHeight: '4rem'
                    }
                ],
                '44-regular': [
                    '2.75rem', {
                        fontWeight: '400',
                        lineHeight: '4rem'
                    }
                ],
                '44-medium': [
                    '2.75rem', {
                        fontWeight: '500',
                        lineHeight: '4rem'
                    }
                ],
                '44-semibold': [
                    '2.75rem', {
                        fontWeight: '600',
                        lineHeight: '4rem'
                    }
                ],
                '44-bold': [
                    '2.75rem', {
                        fontWeight: '700',
                        lineHeight: '4rem'
                    }
                ],
                '48-light': [
                    '3rem', {
                        fontWeight: '300',
                        lineHeight: '4.25rem'
                    }
                ],
                '48-regular': [
                    '3rem', {
                        fontWeight: '400',
                        lineHeight: '4.25rem'
                    }
                ],
                '48-medium': [
                    '3rem', {
                        fontWeight: '500',
                        lineHeight: '4.25rem'
                    }
                ],
                '48-semibold': [
                    '3rem', {
                        fontWeight: '600',
                        lineHeight: '4.25rem'
                    }
                ],
                '48-bold': [
                    '3rem', {
                        fontWeight: '700',
                        lineHeight: '4.25rem'
                    }
                ],
                '56-light': [
                    '3.5rem', {
                        fontWeight: '300',
                        lineHeight: '5rem'
                    }
                ],
                '56-regular': [
                    '3.5rem', {
                        fontWeight: '400',
                        lineHeight: '5rem'
                    }
                ],
                '56-medium': [
                    '3.5rem', {
                        fontWeight: '500',
                        lineHeight: '5rem'
                    }
                ],
                '56-semibold': [
                    '3.5rem', {
                        fontWeight: '600',
                        lineHeight: '5rem'
                    }
                ],
                '56-bold': [
                    '3.5rem', {
                        fontWeight: '700',
                        lineHeight: '5rem'
                    }
                ],
                '64-light': [
                    '4rem', {
                        fontWeight: '300',
                        lineHeight: '5.5rem'
                    }
                ],
                '64-regular': [
                    '4rem', {
                        fontWeight: '400',
                        lineHeight: '5.5rem'
                    }
                ],
                '64-medium': [
                    '4rem', {
                        fontWeight: '500',
                        lineHeight: '5.5rem'
                    }
                ],
                '64-semibold': [
                    '4rem', {
                        fontWeight: '600',
                        lineHeight: '5.5rem'
                    }
                ],
                '64-bold': [
                    '4rem', {
                        fontWeight: '700',
                        lineHeight: '5.5rem'
                    }
                ]
            },
            colors: {
                'tunelog-main': '#1D2123',
                'tunelog-main-dark': '#1A1E1F',
                'tunelog-yellow': '#FACD66',
                'tunelog-gray': '#EFEEE0'
            }
        },
    },
    plugins: [],
}