'use client'

import React, { useMemo } from 'react'
import { Account } from '@/libs/interfaces/account.interface'
import { Button } from '../buttons'
import { useAccount } from '@/libs/utils/account'
import { useRouter } from 'next/navigation'
import { AccountStatus } from '@/libs/constants/account.constant'


interface CardUserListProps {
    account: Omit<Account, 'updatedAt' | 'createdAt'>
}

export const CardUserList = ({
    account,
    ...props
}: CardUserListProps) => {
    const appRouter = useRouter()
    const { status, me } = useAccount()
    
    const isFollowing = useMemo(() => {
        if(status === AccountStatus.guest) return false
        return me?.followingUids?.includes(account._id) || false
    }, [account._id, me?.followingUids, status])
    
    if (!account) return null
    return (
        <div
            className='flex items-center justify-between w-full transition active:scale-[0.98] duration-300 active:bg-gray-800 p-1 rounded-xl'
            {...props}
            onClick={() => {
                appRouter.push(`/account/${account._id}`)
            }}
        >
            <span className='text-white'>{account.name}</span>
            {account._id !== me?._id && <Button.Box text={isFollowing ? 'Unfollow' : 'Follow'} />}
        </div>
    )
}
