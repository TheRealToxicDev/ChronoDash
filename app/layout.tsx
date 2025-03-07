import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/other/ThemeProvider";
import Navbar from "@/components/static/Navbar";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        template: "%s | Sysmanix",
        default: "Sysmanix - Manage your system services with ease.",
    },
    description: "Sysmanix - Manage your system services with ease.",
    icons: {
        icon: "/logo_black.webp",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <Navbar />
                    <Toaster
  position="top-center"
  reverseOrder={false}
/>
                    <main className="pt-16 min-h-screen">{children}</main>
                </ThemeProvider>
            </body>
        </html>
    );
}
