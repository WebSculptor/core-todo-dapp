import type { Metadata } from "next";
import { Rubik as FontSans } from "next/font/google";

import "@/styles/globals.css";

import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";
import Header from "@/components/shared/header";
import { Web3ModalProvider } from "@/context/web3modal";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `${siteConfig.appName} - ${siteConfig.title}`,
  description: siteConfig.description,
  icons: {
    icon: siteConfig.icon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressContentEditableWarning suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/pt-root-ui"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col flex-1",
          fontSans.variable
        )}>
        <Web3ModalProvider>
          <Header />
          {children}
        </Web3ModalProvider>
      </body>
    </html>
  );
}
