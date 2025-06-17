'use client'


import { useGetJournal } from '@/hooks/use-journal'
import React from 'react'


const JournalDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)
    const { data, isLoading } = useGetJournal(id)

    if (isLoading) {
        return <div className='text-white'>Loading...</div>
    }
    return (
        <div className='text-white'>
            Journal Detail Page
            {id}
            <div dangerouslySetInnerHTML={{ __html: data?.content ?? '' }}/>
        </div>
    )
}

export default JournalDetailPage