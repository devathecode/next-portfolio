
import { Poppins, Roboto_Slab } from 'next/font/google';
// import { RobotoSlab } from 'next/font/google';

export const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const robotoSlab = Roboto_Slab({
    subsets: ['latin'], // Specify language subsets if needed (e.g., 'cyrillic')
    weight: ['400'], // Include desired font weights (e.g., ['400', '700'])
    display: 'swap', // Controls font loading behavior (optional)
});