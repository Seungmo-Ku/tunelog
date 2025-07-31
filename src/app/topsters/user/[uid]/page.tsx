'use client'

import { AllTopsters } from '@/components/views/topsters/all-topsters'
import React from 'react'


const UserTopstersPage = ({ params }: { params: Promise<{ uid: string }> }) => {
    const { uid } = React.use(params)
    return (
        <div className='text-white w-full h-full flex flex-col gap-y-10 overflow-y-auto hide-sidebar'>
            <AllTopsters showMyTopster={false} uid={uid}/>
        </div>
    )
}

export default UserTopstersPage