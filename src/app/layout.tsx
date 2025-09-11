'use client'

import { Quicksand } from 'next/font/google'
import './globals.css'
import React, { useEffect, useState } from 'react'
import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Navbar from '@/components/navigation-bar/navitaion-bar-default'
import { Toaster } from 'react-hot-toast'
import { Dialogs } from '@/components/dialogs'
import './i18n'
import { useTranslation } from 'react-i18next'


const quicksand = Quicksand({
    subsets: ['latin'],
    variable: '--font-quicksand'
})

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    const [queryClient] = useState(() => new QueryClient())
    const { i18n } = useTranslation()
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('appLanguage') || 'en'
            i18n.changeLanguage(savedLang)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    useEffect(() => {
        const isInWebView =
            navigator.userAgent.includes('wv') || // 안드로이드 WebView
            window.navigator.userAgent.includes('WebView') // iOS WebView
        if (!isInWebView) {
            function setViewportHeight() {
                const vh = window.innerHeight * 0.01
                document.documentElement.style.setProperty('--vh', `${vh}px`)
            }
            
            window.addEventListener('resize', setViewportHeight)
            setViewportHeight()
            return () => window.removeEventListener('resize', setViewportHeight)
        }
    }, [])
    
    return (
        <html lang='en'>
        <body className={`${quicksand.variable} antialiased w-screen flex items-center justify-center overflow-hidden`} style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
        <QueryClientProvider client={queryClient}>
            <div className='flex md:flex-row flex-col w-full h-full max-w-[1440px] md:px-4 overflow-hidden'>
                <Navbar/>
                <main className='flex-1 max-h-full md:p-5 p-1 overflow-hidden'>
                    <Toaster/>
                    {children}
                </main>
                <Dialogs.Login/>
                <Dialogs.Register/>
                <Dialogs.Logout/>
                <Dialogs.Settings/>
                <Dialogs.Comment/>
            </div>
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={true}/>}
        </QueryClientProvider>
        </body>
        </html>
    )
}
