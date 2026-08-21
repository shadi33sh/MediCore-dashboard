import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import DarkModeToggle from "../Components/toggleDarkMode";
import NProgressHandler from "../Components/NProgressHandler";
import GoogleTranslate from "../Components/GoogleTranslate"; // ✅ import the component
import { AlertProvider } from "../Components/Alert";
import { AuthProvider } from "../context/AuthContext";
import I18nProvider from "../Components/I18nProvider";
import localFont from 'next/font/local';
import { Cairo } from 'next/font/google';

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  display: 'swap',
});

const montserrat = localFont({
  src: [
    { path: '../fonts/Alexandria-Thin.ttf', weight: '100', style: 'normal' },
    { path: '../fonts/Alexandria-ExtraLight.ttf', weight: '200', style: 'normal' },
    { path: '../fonts/Alexandria-Light.ttf', weight: '300', style: 'normal' },
    { path: '../fonts/Alexandria-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/Alexandria-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../fonts/Alexandria-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/Alexandria-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../fonts/Alexandria-ExtraBold.ttf', weight: '800', style: 'normal' },
    { path: '../fonts/Alexandria-Black.ttf', weight: '900', style: 'normal' },
  ],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "MadiCore | Dashboard",
  description: "MadiCore Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={false} style={{ fontSize: '80%' }} className={`${montserrat.variable} ${cairo.variable} text-black dark:text-white transition-colors duration-1000`}>
      <head>
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        /> */}
      </head>
      <body className={`${montserrat.className} antialiased dark:bg-black font-sans`}>
        <I18nProvider>
          <AlertProvider>
            <AuthProvider>
              <NProgressHandler />
              <DarkModeToggle />
              {children}
            </AuthProvider>
          </AlertProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
