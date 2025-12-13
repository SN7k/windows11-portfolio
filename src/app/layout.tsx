import type { Metadata } from 'next'
import './globals.css'
import { ConnectionProvider } from '@/contexts/ConnectionContext'
import { VolumeProvider } from '@/contexts/VolumeContext'
import { WindowsProvider } from '@/contexts/WindowsContext'
import { GoBackProvider } from '@/contexts/GoBackContext'
import CopyProtection from '@/components/CopyProtection'

export const metadata: Metadata = {
  title: 'WinStyle-Portfolio | SNK',
  description: 'Windows 11 style portfolio by Shombhunath Karan (SNK) - Full Stack Developer specializing in MERN stack',
  keywords: 'portfolio, snk, developer, projects, windows 11, full stack, MERN, react, node.js, mongodb',
  authors: [{ name: 'SNK', url: 'https://snk.codes' }],
  robots: 'index, follow',
  applicationName: 'SNK Portfolio',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SNK Portfolio',
  },
  openGraph: {
    type: 'website',
    title: 'WinStyle-Portfolio | SNK',
    description: 'Windows 11 style portfolio by Shombhunath Karan (SNK) - Full Stack Developer',
    siteName: 'SNK Portfolio',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WinStyle-Portfolio | SNK',
    description: 'Windows 11 style portfolio by Shombhunath Karan (SNK) - Full Stack Developer',
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
