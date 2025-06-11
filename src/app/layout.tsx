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
    
    return (
        <html lang='en'>
        <body className={`${quicksand.variable} antialiased w-screen h-screen`}>
        <QueryClientProvider client={queryClient}>
            <div className='flex w-full h-full'>
                <Navbar />
                {children}
            </div>
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={true}/>}
        </QueryClientProvider>
        </body>
        </html>
    )
}
