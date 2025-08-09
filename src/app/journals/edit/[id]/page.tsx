'use client'

import React from 'react'
import { useGetJournal } from '@/hooks/use-journal'
import { CreatingJournal } from '@/components/views/journals/creating-journal'
import { useIsOwner } from '@/libs/utils/account'


const JournalEditPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)
    const { data: journal, isLoading } = useGetJournal(id)
    const isOwner = useIsOwner(journal?.uid)
    
    if (isLoading) {
        return (
            <div className='flex items-center justify-center w-full h-full text-white'>
                <p>Loading...</p>
            </div>
        )
    }
    if (!journal || !isOwner) {
        return (
            <div className='flex items-center justify-center w-full h-full text-white'>
                <p>Journal not found</p>
            </div>
        )
    }
    return (
        <div className='flex flex-col w-full h-full overflow-y-auto hide-sidebar text-white'>
            <CreatingJournal journal={journal}/>
        </div>
    )
}

export default JournalEditPage