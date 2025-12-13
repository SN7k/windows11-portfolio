import type { Metadata } from 'next'
import './globals.css'
import { ConnectionProvider } from '@/contexts/ConnectionContext'
import { VolumeProvider } from '@/contexts/VolumeContext'
import { WindowsProvider } from '@/contexts/WindowsContext'
import { GoBackProvider } from '@/contexts/GoBackContext'
import CopyProtection from '@/components/CopyProtection'

export const metadata: Metadata = {
  title: 'WinStyle-Portfolio | SNK',
  description: 'WinStyle-Portfolio by SNK.',
  keywords: 'portfolio, snk, developer, projects',
  authors: [{ name: 'SNK' }],
  robots: 'index, follow',
  applicationName: 'WinStyle-Portfolio | SNK',
  openGraph: {
    type: 'website',
    title: 'WinStyle-Portfolio | SNK',
    description: 'WinStyle-Portfolio by SNK.',
    siteName: 'WinStyle-Portfolio | SNK',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'WinStyle-Portfolio | SNK',
    description: 'WinStyle-Portfolio by SNK.',
  },
}

export const viewport = {
  themeColor: '#000000',
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
