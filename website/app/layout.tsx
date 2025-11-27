import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Happy Path Marketing | AI-Powered Marketing Automation',
  description: 'Transform your marketing with AI-powered automation, custom software development, and cutting-edge digital marketing solutions. Save $8K+ annually while scaling your business.',
  keywords: ['AI marketing', 'marketing automation', 'GoHighLevel', 'AI voice assistants', 'custom software', 'digital marketing', 'SEO', 'content generation'],
  authors: [{ name: 'Happy Path Marketing' }],
  creator: 'Happy Path Marketing',
  publisher: 'Happy Path Marketing',
  metadataBase: new URL('https://happypathmarketing.com'),
  openGraph: {
    title: 'Happy Path Marketing | AI-Powered Marketing Automation',
    description: 'Transform your marketing with AI-powered automation and cutting-edge solutions.',
    url: 'https://happypathmarketing.com',
    siteName: 'Happy Path Marketing',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Happy Path Marketing | AI-Powered Marketing Automation',
    description: 'Transform your marketing with AI-powered automation and cutting-edge solutions.',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans custom-scrollbar">
        <div className="mesh-gradient fixed inset-0 -z-10" />
        <Header />
        <main className="relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
