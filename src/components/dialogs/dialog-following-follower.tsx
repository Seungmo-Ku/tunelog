'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import React, { useMemo } from 'react'
import { capitalizeFirstLetter } from '@/libs/utils/string'
import { useGetUserFollower, useGetUserFollowing } from '@/hooks/use-account'
import { Account } from '@/libs/interfaces/account.interface'
import { useRouter } from 'next/navigation'
import { Cards } from '@/components/cards'


interface DialogFollowingFollowerProps {
    open: boolean
    onCloseAction: () => void
    uid: string
    type: 'following' | 'follower'
}

export const DialogFollowingFollower = ({
    open,
    onCloseAction,
    uid,
    type
}: DialogFollowingFollowerProps) => {
    const { data: followingData, isLoading: isFollowingLoading } = useGetUserFollowing(type === 'following' ? uid : '')
    const { data: followerData, isLoading: isFollowerLoading } = useGetUserFollower(type === 'follower' ? uid : '')
    const following = useMemo(() => {
        if (isFollowingLoading || type !== 'following') return []
        const followingsArray = followingData?.pages.flatMap(page => page.data) ?? []
        return followingsArray?.map(account => new Account(account)) ?? []
    }, [followingData?.pages, isFollowingLoading, type])
    const follower = useMemo(() => {
        if (isFollowerLoading || type !== 'follower') return []
        const followersArray = followerData?.pages.flatMap(page => page.data) ?? []
        return followersArray?.map(account => new Account(account)) ?? []
    }, [followerData?.pages, isFollowerLoading, type])
    
    return (
        <Dialog transition open={open} onClose={onCloseAction} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 bg-black/50' aria-hidden='true'/>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                <DialogPanel className='w-3/4 space-y-4 bg-[#33373B] text-white md:p-12 p-4 rounded-2xl flex flex-col'>
                    <DialogTitle className='font-bold'>{capitalizeFirstLetter(type)}</DialogTitle>
                    <div className='flex flex-col gap-y-2'>
                        {
                            type === 'following' ? (
                                following.map(account => {
                                    return (
                                        <Cards.UserList account={account} key={account._id}/>
                                    )
                                })
                            ) : (
                                follower.map(account => {
                                    return (
                                        <Cards.UserList account={account} key={account._id}/>
                                    )
                                })
                            )
                        }
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}