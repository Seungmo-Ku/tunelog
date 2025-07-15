'use client'

import React from 'react'
import { useGetJournal } from '@/hooks/use-journal'
import { CreatingComponent } from '@/components/views/journals/creating-component'


const JournalEditPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)
    const { data: journal, isLoading } = useGetJournal(id)
    if (isLoading) {
        return (
            <div className='flex items-center justify-center w-full h-full text-white'>
                <p>Loading...</p>
            </div>
        )
    }
    return (
        <div className='flex flex-col w-full h-full overflow-y-auto hide-sidebar text-white'>
            <CreatingComponent journal={journal}/>
        </div>
    )
}

export default JournalEditPage