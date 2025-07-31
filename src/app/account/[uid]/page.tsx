'use client'

import React from 'react'
import { useGetOthersObjectCount, useGetUserById } from '@/hooks/use-account'
import { Cards } from '@/components/cards'
import { useAccount } from '@/libs/utils/account'


const AccountIdPage = ({ params }: { params: Promise<{ uid: string }> }) => {
    const { uid } = React.use(params)
    const { me } = useAccount()
    const { data, isLoading } = useGetUserById(uid)
    const { data: objectCount } = useGetOthersObjectCount(uid)
    if (isLoading) {
        return <div className='text-white'>Loading...</div>
    }
    if (!data) {
        return <div className='text-white'>Account not found</div>
    }
    return (
        <div className='overflow-y-auto hide-sidebar h-full'>
            <Cards.Account account={data} isMyAccount={me?._id ? uid === me._id : false} objectCount={objectCount}/>
        </div>
    )
}

export default AccountIdPage