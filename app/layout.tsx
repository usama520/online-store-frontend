import type { Metadata } from "next";
import "./globals.css";
import { ApolloProvider } from "@/lib/providers/ApolloProvider";
import { ToastProvider } from "@/lib/providers/ToastProvider";
import { ToastWrapper } from "@/components/ui/ToastWrapper";

export const metadata: Metadata = {
  title: "My Online Store",
  description: "Your one-stop shop for amazing products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider>
          <ToastProvider>
            {children}
            <ToastWrapper />
          </ToastProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
