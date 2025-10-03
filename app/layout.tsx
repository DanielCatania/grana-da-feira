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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex justify-center items-center backdrop-blur-md text-xs mb-2 fixed top-0 left-0 right-0 z-50">
            <p className="text-white">
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
          </div>
          <div className="bg-geometric flex items-center justify-center">
            <div className="flex-col flex items-center justify-center w-2/5 min-w-64 py-2">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
