import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import EnhancedErrorBoundary from "@/components/EnhancedErrorBoundary";
import { AppProvider } from "@/contexts/AppContext";
import TimeThemeProvider from "@/components/TimeThemeProvider";
import { AudioProvider } from "@/components/AudioProvider";
import CustomCursor from "@/components/CustomCursor";
import FloatingParticles from "@/components/FloatingParticles";
import CursorLightEffect from "@/components/CursorLightEffect";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vilidaymond.netlify.app'),
  title: "Vili Daymond | Digital Artist & Creative Visionary",
  description: "Explore the dark, artistic world of Vili Daymond. Digital artist specializing in mysterious, gothic aesthetics and creative visual storytelling.",
  keywords: ["digital artist", "gothic art", "dark aesthetics", "creative visionary", "portfolio", "mysterious art"],
  authors: [{ name: "Vili Daymond" }],
  creator: "Vili Daymond",
  openGraph: {
    title: "Vili Daymond | Digital Artist & Creative Visionary",
    description: "Explore the dark, artistic world of Vili Daymond. Digital artist specializing in mysterious, gothic aesthetics.",
    url: "https://vilidaymond.netlify.app",
    siteName: "Vili Daymond Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vili Daymond - Digital Artist Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vili Daymond | Digital Artist",
    description: "Dark, mysterious digital art and creative visionary work.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body
        className={`${inter.variable} ${playfairDisplay.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <EnhancedErrorBoundary name="RootLayout">
          <AppProvider>
            <TimeThemeProvider>
              <AudioProvider>
                <CustomCursor />
                <FloatingParticles />
                <CursorLightEffect />
                {children}
              </AudioProvider>
            </TimeThemeProvider>
          </AppProvider>
        </EnhancedErrorBoundary>
      </body>
    </html>
  );
}
