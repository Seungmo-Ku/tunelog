'use client'

import { AllJournals } from '@/components/views/journals/all-journals'
import React from 'react'


const UserJournalsPage = ({ params }: { params: Promise<{ uid: string }> }) => {
    const { uid } = React.use(params)
    return (
        <div className='w-full h-full flex flex-col overflow-y-scroll hide-sidebar'>
            <AllJournals showMyJournal={false} uid={uid}/>
        </div>
    )
}

export default UserJournalsPage