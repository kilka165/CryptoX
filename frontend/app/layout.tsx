import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/components/I18nProvider";
import { RatesProvider } from "@/components/RatesProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CryptoX Exchange",
  description: "Лучшая крипто-биржа",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <RatesProvider>{children}</RatesProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
