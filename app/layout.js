import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/providers/AuthProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Fast English - Cursuri de Limba Engleză",
    template: "%s | Fast English"
  },
  description: "Fast English - Învață engleza rapid și eficient! Cursuri de limba engleză pentru toate nivelurile și vârstele. Profesori nativi, metode moderne, rezultate garantate.",
  keywords: [
    "cursuri engleza",
    "cursuri limba engleză", 
    "învață engleza",
    "english courses",
    "cursuri engleza copii",
    "cursuri engleza adulți",
    "conversație engleză",
    "pregătire Cambridge",
    "Fast English",
    "școală de engleză"
  ],
  authors: [{ name: "Fast English" }],
  creator: "Fast English",
  publisher: "Fast English",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://fastenglish.md"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Fast English - Cursuri de Limba Engleză",
    description: "Învață engleza rapid și eficient! Cursuri pentru toate nivelurile și vârstele. Profesori calificați, metode moderne.",
    url: "https://fastenglish.md",
    siteName: "Fast English",
    locale: "ro_RO",
    type: "website",
    images: [
      {
        url: "/FastEnglish-logo.png",
        width: 512,
        height: 512,
        alt: "Fast English Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fast English - Cursuri de Limba Engleză",
    description: "Învață engleza rapid și eficient! Cursuri pentru toate nivelurile și vârstele. Profesori calificați, metode moderne.",
    images: ["/FastEnglish-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  verification: {
    // google: "your-google-verification-code",
  },
  category: "education",
};

// Script to apply theme before page renders to prevent flash
const themeScript = `
  (function() {
    try {
      const theme = localStorage.getItem('theme');
      if (theme === 'light') {
        document.documentElement.classList.add('light');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
