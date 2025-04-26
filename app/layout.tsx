import type React from "react";
import { Heart, Mail, Twitter } from "lucide-react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IPL 2025 Playoff Predictor",
  description:
    "Track current standings, analyze playoff chances, and simulate scenarios for your favorite IPL teams",
  icons: {
    icon: "/ipl-favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            <footer className="border-t mt-8">
              <div className="max-w-7xl mx-auto py-6 px-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Built with
                    </span>
                    <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
                    <span className="text-gray-600 dark:text-gray-400">
                      for cricket fans
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Report any issues/feedback:
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <a
                      href="mailto:hemanth78659@gmail.com"
                      className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>hemanth78659@gmail.com</span>
                    </a>
                    <a
                      href="https://x.com/Hemant78923"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                      <span>@Hemant78923</span>
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
