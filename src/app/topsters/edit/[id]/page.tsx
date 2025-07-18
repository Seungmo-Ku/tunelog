'use client'

import React from 'react'
import { useGetTopster } from '@/hooks/use-topster'
import { TopsterCreate } from '@/components/views/topsters/topster-create'


const TopsterEditPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)
    const { data: topster, isLoading } = useGetTopster(id)
    if (isLoading) {
        return (
            <div className='flex items-center justify-center w-full h-full text-white'>
                <p>Loading...</p>
            </div>
        )
    }
    if (!topster) {
        return (
            <div className='flex items-center justify-center w-full h-full text-white'>
                <p>Topster not found</p>
            </div>
        )
    }
    return (
        <div className='flex flex-col w-full h-full overflow-y-auto hide-sidebar text-white'>
            <TopsterCreate topster={isLoading ? null : topster}/>
        </div>
    )
}

export default TopsterEditPage