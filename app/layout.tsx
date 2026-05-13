import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata = {
  title: 'Crypto Trading Journal',
  description: 'Modern web app for tracking crypto trades and analytics',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen bg-dark-background text-gray-200">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </div>
      </body>
    </html>
  )
}