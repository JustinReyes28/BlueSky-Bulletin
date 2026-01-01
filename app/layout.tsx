import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { headers } from 'next/headers';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "BlueSky | Your Friendly Weather Guide",
  description: "Get easy-to-understand weather updates and cool recommendations tailored just for you.",
  icons: {
    icon: './images/favicon.png',
  },
};

function generateNonce() {
    return crypto.randomUUID();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = generateNonce();

  return (
    <html lang="en">
      <head>
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.__nonce = '${nonce}';`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${manrope.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
