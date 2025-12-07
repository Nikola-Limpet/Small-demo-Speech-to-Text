import type { Metadata } from 'next'
import { Geist, Geist_Mono, Noto_Serif_Khmer } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const notoSerifKhmer = Noto_Serif_Khmer({
  subsets: ['khmer'],
  variable: '--font-khmer',
  display: 'swap',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'RorHash - Khmer & English Voice AI',
  description: 'Bilingual voice AI app with Gemini 2.5 Live API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${notoSerifKhmer.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
