import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DriveFleet | Premium Car Rental Platform",
  description: "Explore available cars, view details, rent vehicles, manage bookings, and maintain profiles securely.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Google Identity Services SDK for Google Sign-In */}
        <Script 
          src="https://accounts.google.com/gsi/client" 
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-black dark:text-zinc-50 transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
