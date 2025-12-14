import type { Metadata } from 'next'
import './globals.css'
import { ConnectionProvider } from '@/contexts/ConnectionContext'
import { VolumeProvider } from '@/contexts/VolumeContext'
import { WindowsProvider } from '@/contexts/WindowsContext'
import { GoBackProvider } from '@/contexts/GoBackContext'
import CopyProtection from '@/components/CopyProtection'

export const metadata: Metadata = {
  title: 'Shombhunath Karan | Full Stack Developer Portfolio',
  description: 'Portfolio of Shombhunath Karan (SNK) - Full Stack Developer specializing in MERN stack, React, Node.js, MongoDB. Explore my projects and get in touch.',
  keywords: 'Shombhunath Karan, SNK, Full Stack Developer, MERN Stack, React Developer, Node.js Developer, MongoDB, Portfolio, Web Developer, JavaScript Developer, Frontend Developer, Backend Developer',
  authors: [{ name: 'Shombhunath Karan', url: 'https://github.com/SN7k' }],
  creator: 'Shombhunath Karan',
  publisher: 'Shombhunath Karan',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  applicationName: 'SNK Portfolio',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SNK Portfolio',
  },
  openGraph: {
    type: 'website',
    title: 'Shombhunath Karan | Full Stack Developer Portfolio',
    description: 'Portfolio of Shombhunath Karan (SNK) - Full Stack Developer specializing in MERN stack. View my projects and skills.',
    siteName: 'SNK Portfolio',
    locale: 'en_US',
    url: 'https://portfolio.snk.codes',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Shombhunath Karan Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shombhunath Karan | Full Stack Developer Portfolio',
    description: 'Portfolio of Shombhunath Karan (SNK) - Full Stack Developer specializing in MERN stack',
    creator: '@shombhu__',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://portfolio.snk.codes',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export const viewport = {
  themeColor: '#0078D4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href={require('@/data/cloudinary-images.json').windowsMenu} />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/dlpskz98w/image/upload/v1765637284/windowsmenu_hdoevn.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SNK Portfolio" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Shombhunath Karan',
              alternateName: 'SNK',
              url: 'https://portfolio.snk.codes',
              image: 'https://portfolio.snk.codes/og-image.png',
              jobTitle: 'Full Stack Developer',
              description: 'Full Stack Developer specializing in MERN stack, React, Node.js, and MongoDB',
              sameAs: [
                'https://github.com/SN7k',
                'https://instagram.com/shombhu__',
                'https://linkedin.com/in/shombhunath-karan',
              ],
              knowsAbout: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript', 'MERN Stack', 'Web Development'],
            }),
          }}
        />
      </head>
      <body className="cursor-default">
        <CopyProtection />
        <ConnectionProvider>
          <VolumeProvider>
            <WindowsProvider>
              <GoBackProvider>
                {children}
              </GoBackProvider>
            </WindowsProvider>
          </VolumeProvider>
        </ConnectionProvider>
      </body>
    </html>
  )
}
