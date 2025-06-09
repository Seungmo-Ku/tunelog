'use client'

import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { useState } from 'react'
import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
})

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [queryClient] = useState(() => new QueryClient())
    
    return (
        <html lang='en'>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={true} />}
        </QueryClientProvider>
        </body>
        </html>
    )
}
