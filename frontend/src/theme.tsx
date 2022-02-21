import { extendTheme } from '@chakra-ui/react';

export default extendTheme({
    styles: {
        global: {
            body: {
                bg: 'gray.50',
            },
        },
    },

    colors: {
        transparent: 'transparent',
        white: '#ffffff',
        black: '#000000',
        orange: {
            50: '#fff1dc',
            100: '#ffd6af',
            200: '#ffbd7f',
            300: '#ffa24d',
            400: '#fe881c',
            500: '#e56e03',
            600: '#b35600',
            700: '#803d00',
            800: '#4e2400',
            900: '#1f0a00',
        },
        gray: {
            50: '#F9F9F9',
            100: '#BCBCBC',
            200: '#ACACAC',
            300: '#C4C4C4',
            400: '#626262',
        },
        red: '#EE6439',
        green: '#76CE6F',
        blue: '#68A4FF',
        yellow: '#FFEB50',
    },
    fonts: {
        heading: 'Russo One, sans-serif',
        body: 'Roboto, sans-serif',
    },
});
