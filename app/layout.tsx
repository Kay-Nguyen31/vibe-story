import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { MusicPlayer } from '@/components/music-player'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist-sans"
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

export const metadata: Metadata = {
  title: {
    default: 'Vibe Truyện - Đọc truyện tranh online miễn phí',
    template: '%s | Vibe Truyện',
  },
  description: 'Nền tảng đọc truyện tranh online miễn phí với hàng ngàn tác phẩm hấp dẫn thuộc nhiều thể loại: ngôn tình, tiên hiệp, đam mỹ, xuyên không,... Cập nhật nhanh nhất.',
  keywords: ['truyện tranh', 'đọc truyện online', 'truyện ngôn tình', 'truyện tiên hiệp', 'truyện đam mỹ', 'Vibe Truyện', 'manga', 'manhua', 'manhwa'],
  generator: 'Next.js',
  metadataBase: new URL('https://vibetruyen.click'),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Vibe Truyện',
    title: 'Vibe Truyện - Đọc truyện tranh online miễn phí',
    description: 'Nền tảng đọc truyện tranh online miễn phí với hàng ngàn tác phẩm hấp dẫn.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vibe Truyện - Đọc truyện tranh online miễn phí',
    description: 'Nền tảng đọc truyện tranh online miễn phí với hàng ngàn tác phẩm hấp dẫn.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0d0a1a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vibe Truyện',
    url: 'https://vibetruyen.click',
    description: 'Nền tảng đọc truyện tranh online miễn phí với hàng ngàn tác phẩm hấp dẫn.',
    inLanguage: 'vi-VN',
  }

  return (
    <html lang="vi" className="bg-[#0d0a1a]">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="google-site-verification" content="izuDupb6j4hLL0laVjXJLuVOu36cca9bGhSInHDPZr4" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-[#0d0a1a] text-[#f5f5f7]`}>
        {children}
        <MusicPlayer />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
