import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "FundedPro - Empowering Promising Traders Worldwide",
  description:
    "Access funded trading accounts with extended evaluation periods, industry-leading profit splits, and seamless trading integration.",
  robots: "index, follow",
  keywords: "funded trading, prop trading, forex, trading challenge, live trading accounts",
  authors: [{ name: "FundedPro" }],
  openGraph: {
    title: "FundedPro - Empowering Promising Traders Worldwide",
    description: "Access funded trading accounts with extended evaluation periods, industry-leading profit splits, and seamless trading integration.",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} antialiased dark`}>
      <body 
        className="min-h-screen bg-gradient-to-br from-[#2d1b69] via-[#1a237e] to-[#0f1419]"
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  )
}
