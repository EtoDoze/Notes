import "./globals.css";

import { Wave } from '@/app/components/wave'
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}>
        {children}
        <Wave/>
      </body>
    </html>
  );
}
