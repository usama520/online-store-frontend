import type { Metadata } from "next";
import "./globals.css";
import { ApolloProvider } from "@/lib/providers/ApolloProvider";
import { ToastProvider } from "@/lib/providers/ToastProvider";
import { ToastWrapper } from "@/components/ui/ToastWrapper";
import { ThemeProvider } from "@/lib/providers/ThemeProvider";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_STORE_NAME || "My Online Store",
  description:
    process.env.NEXT_PUBLIC_STORE_DESCRIPTION ||
    "Your one-stop shop for amazing products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Inline script to apply cached theme before hydration (prevents flash)
  const themeScript = `
    (function() {
      try {
        var validThemes = ["neutral", "sage", "indigo", "terracotta", "rose", "sky", "lavender", "mint", "warmWelcoming", "freshClean", "elegantSophisticated", "calmTrustworthy"];
        var cached = localStorage.getItem("store-theme");
        if (cached && validThemes.indexOf(cached) !== -1) {
          document.documentElement.setAttribute("data-theme", cached);
        }
      } catch (e) {}
    })();
  `;

  return (
    <html lang="en" data-theme="freshClean" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <ApolloProvider>
          <ToastProvider>
            <ThemeProvider>{children}</ThemeProvider>
            <ToastWrapper />
          </ToastProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
