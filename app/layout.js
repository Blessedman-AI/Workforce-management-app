import './globals.css';
import { Roboto, Merriweather } from 'next/font/google';

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-merriweather',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${merriweather.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}

// // import { Readexpro, Merriweather, Roboto } from 'next/font/google';
// import { Roboto, Merriweather } from 'next/font/google';

// import './globals.css';
// import Navbar from '@/components/dashboard/Navbar';

// const merriweather = Merriweather({
//   subsets: ['latin'],
//   weight: ['400', '700'], // Specify weights you want to use
//   display: 'swap',
//   variable: '--font-merriweather',
// });

// const roboto = Roboto({
//   subsets: ['latin'],
//   weight: ['300', '400', '500', '700'],
//   display: 'swap',
//   variable: '--font-roboto',
// });

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body
//         className={` mx-auto flex flex-col
//           ${roboto.variable} ${merriweather.variable} font-sans `}
//       >
//         <div>
//           <Navbar />
//         </div>
//         <div>{children}</div>
//         <div></div>
//       </body>
//     </html>
//   );
// }
