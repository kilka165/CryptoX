import type { Metadata } from "next";
import { Inter } from "next/font/google";
// 👇 ЭТОТ ИМПОРТ ОЧЕНЬ ВАЖЕН, ОН ДОЛЖЕН БЫТЬ ЗДЕСЬ
import "./globals.css"; 
import { ThemeProvider } from "@/components/theme-provider";

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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
