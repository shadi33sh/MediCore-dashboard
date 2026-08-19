import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import DarkModeToggle from "../Components/toggleDarkMode";
import NProgressHandler from "../Components/NProgressHandler";
import GoogleTranslate from "../Components/GoogleTranslate"; // ✅ import the component
import { AlertProvider } from "../Components/Alert";
import { AuthProvider } from "../context/AuthContext";
import I18nProvider from "../Components/I18nProvider";

export const metadata: Metadata = {
  title: "SpaceFlightNews",
  description: "Space Flight News, Daily Feeds",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ fontSize: '80%' }} className="text-black dark:text-white transition-colors duration-1000">
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
      <body className="antialiased dark:bg-black">
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
