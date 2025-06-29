import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import defaultUrl from "@/utils/defaultUrl";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl()),
  title: "Grana Da Feira",
  description: "O seu dinheiro virtual para a feira cultural.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
