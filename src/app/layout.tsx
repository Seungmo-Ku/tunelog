'use client'

import { Quicksand } from 'next/font/google'
import './globals.css'
import { useState } from 'react'
import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Navbar from '@/components/navigation-bar/navitaion-bar-default'


const quicksand = Quicksand({
    subsets: ['latin'],
    variable: '--font-quicksand'
})

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [queryClient] = useState(() => new QueryClient())
    
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    
    window.addEventListener('resize', setViewportHeight)
    setViewportHeight()
    
    return (
        <html lang='en'>
        <body className={`${quicksand.variable} antialiased w-screen flex items-center justify-center overflow-hidden`} style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
        <QueryClientProvider client={queryClient}>
            <div className='flex w-full h-full max-w-[1440px] md:px-4 p-1 overflow-hidden'>
                <Navbar/>
                <main className='flex-1 max-h-full md:p-5 overflow-hidden'>
                    {children}
                </main>
            </div>
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={true}/>}
        </QueryClientProvider>
        </body>
        </html>
    )
}
