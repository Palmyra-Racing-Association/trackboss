import { extendTheme } from '@chakra-ui/react';

export default extendTheme({
    colors: {
        transparent: 'transparent',
        white: '#ffffff',
        black: '#000000',
        orange: '#FF9F46',
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
    },
    fonts: {
        heading: 'Russo One, sans-serif',
        body: 'Roboto, sans-serif',
    },
});
