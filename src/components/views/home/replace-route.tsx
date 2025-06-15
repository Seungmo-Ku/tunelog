'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'


export const ReplaceRoute = () => {
    const appRouter = useRouter()
    
    useEffect(() => {
        appRouter.replace('/dashboard')
    }, [appRouter])
    
    return (
        <div>
            welcome to tunelog
        </div>
    )
}