import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Berlin Club Bouncer | AI Judge",
  description: "Get judged by Berlin's most notorious club bouncers. Will your outfit make it past Berghain, KitKat, or Sisyphus?",
  keywords: ["Berlin", "nightlife", "AI", "club", "bouncer", "Berghain", "KitKat", "Sisyphus"],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
