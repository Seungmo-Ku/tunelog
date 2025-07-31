'use client'

import { AllRatings } from '@/components/views/ratings/all-ratings'
import React from 'react'


const UserRatingsPage = ({ params }: { params: Promise<{ uid: string }> }) => {
    const { uid } = React.use(params)
    return (
        <div className='flex flex-col gap-y-10 w-full h-full overflow-y-scroll hide-sidebar'>
            <AllRatings showMyRating={false} uid={uid}/>
        </div>
    )
}

export default UserRatingsPage