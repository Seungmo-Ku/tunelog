'use client'

import React from 'react'
import { useAccount } from '@/libs/utils/account'
import { AccountStatus } from '@/libs/constants/account.constant'
import { CommunityPageComponent } from '@/components/views/community/community-page-component'


export const FollowingObjects = () => {
    const { status } = useAccount()
    if (status === AccountStatus.guest) return null
    return (
        <div className='flex flex-col gap-y-3'>
            <h2 className='text-24-bold text-tunelog-light'>From Followings</h2>
            <CommunityPageComponent viewOnlyFollowing/>
        </div>
    )
}