import 'styles/globals.css';

import { Mulish } from 'next/font/google';

const mulish = Mulish({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={mulish.className}>{children}</body>
    </html>
  );
}
