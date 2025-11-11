import type { Metadata } from "next";
import "./globals.css";
import { ApolloProvider } from "@/lib/providers/ApolloProvider";

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
        <ApolloProvider>{children}</ApolloProvider>
      </body>
    </html>
  );
}
