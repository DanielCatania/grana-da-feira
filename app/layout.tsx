import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import defaultUrl from "@/utils/defaultUrl";
import Link from "next/link";

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
        <header className="flex justify-center items-center backdrop-blur-md text-xs mb-2">
          <p>
            Desenvolvido por{" "}
            <Link
              href="https://github.com/DanielCatania"
              target="_blank"
              className="underline text-primary-100"
            >
              ©Daniel Catania
            </Link>{" "}
            - 2025
          </p>
        </header>
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
