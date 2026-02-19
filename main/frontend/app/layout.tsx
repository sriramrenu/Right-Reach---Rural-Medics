import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import VoiceAssistant from '@/components/VoiceAssistant'

export const metadata = {
  title: "Right Reach - Inclusive Digital Healthcare",
  description: "Secure health records, personalized medicine tracking, and telemedicine for rural communities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans`}>
        {children}
        <VoiceAssistant />
        <Analytics />
      </body>
    </html>
  )
}
