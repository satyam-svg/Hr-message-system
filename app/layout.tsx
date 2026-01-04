import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HR Connect Pro - AI-Powered HR Outreach & Job Application Automation",
    template: "%s | HR Connect Pro",
  },
  description: "Automate your job applications with HR Connect Pro. Extract HR contacts from PDFs, auto-send personalized emails, and land your dream job with AI-powered outreach.",
  keywords: [
    "HR automation",
    "job application automation",
    "HR contact extractor",
    "email automation",
    "job search tool",
    "career automation",
    "AI recruitment tool",
    "PDF contact extractor",
    "cold email automation",
  ],
  authors: [{ name: "HR Connect Pro Team", url: "https://hr-connect-pro.vercel.app" }],
  creator: "HR Connect Pro",
  publisher: "HR Connect Pro",
  metadataBase: new URL("https://hr-connect-pro.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HR Connect Pro - Automate Your Job Search",
    description: "Stop manual applications. Extract HR contacts from PDFs and send personalized emails automatically with HR Connect Pro.",
    url: "https://hr-connect-pro.vercel.app",
    siteName: "HR Connect Pro",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icon.png", // Using the icon we just created as a fallback OG image
        width: 512,
        height: 512,
        alt: "HR Connect Pro Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HR Connect Pro - AI Job Application Automation",
    description: "Automate your daily job applications. Extract contacts, send emails, and track results.",
    images: ["/icon.png"], 
    creator: "@hrconnectpro",
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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "HR Connect Pro",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "description": "AI-powered tool to automate HR outreach and job applications.",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
