import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import EnhancedErrorBoundary from "@/components/EnhancedErrorBoundary";
import { AppProvider } from "@/contexts/AppContext";
import TimeThemeProvider from "@/components/TimeThemeProvider";
import { AudioProvider } from "@/components/AudioProvider";
import UnifiedCursor from "@/components/UnifiedCursor";
import UnifiedParticleSystem from "@/components/UnifiedParticleSystem";

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
        
        {/* Favicon pour tous les navigateurs et OS */}
        <link rel="icon" href="/favicon.ico?v=4" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192.png?v=4" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-192.png?v=4" />
        <link rel="shortcut icon" href="/favicon.ico?v=4" />
        
        {/* Windows desktop et taskbar */}
        <meta name="msapplication-TileImage" content="/icon-512.png" />
        <meta name="msapplication-TileColor" content="#0A0A0A" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* iOS PWA Support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Portfolio" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-startup-image" href="/icon-512.png" />
        
        {/* Additional PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Portfolio" />
      </head>
      <body
        className={`${inter.variable} ${playfairDisplay.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <EnhancedErrorBoundary name="RootLayout">
          <AppProvider>
            <TimeThemeProvider>
              <AudioProvider>
                <UnifiedCursor 
                  config={{
                    showCursor: true,
                    showLightEffect: true,
                    lightIntensity: 0.6,
                    trailEffect: true
                  }}
                />
                <UnifiedParticleSystem 
                  config={{
                    type: 'floating',
                    count: 50,
                    effects: { glow: true, connections: false, trails: false }
                  }}
                />
                {children}
              </AudioProvider>
            </TimeThemeProvider>
          </AppProvider>
        </EnhancedErrorBoundary>
      </body>
    </html>
  );
}
