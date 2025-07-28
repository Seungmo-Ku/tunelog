'use client'

import { Account } from '@/libs/interfaces/account.interface'
import { Button } from '@/components/buttons'
import { useHandleLogout } from '@/hooks/use-account'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useAccount } from '@/libs/utils/account'
import { Dialogs } from '@/components/dialogs'
import { ObjectCountResponse } from '@/libs/dto/account.dto'


interface CardAccountProps {
    account: Account | null | undefined
    isMyAccount?: boolean
    objectCount: ObjectCountResponse | null | undefined
}

export const CardAccount = ({
    account,
    objectCount,
    isMyAccount = false
}: CardAccountProps) => {
    const { mutateAsync, isPending } = useHandleLogout()
    const { me } = useAccount()
    const appRouter = useRouter()
    const [openUidDialog, setOpenUidDialog] = useState<boolean>(false)
    const [type, setType] = useState<'following' | 'follower'>('following')
    
    const handleLogOut = useCallback(async () => {
        if (isPending) return
        try {
            const response = await mutateAsync()
            if (response) {
                toast.success('Log Out successful')
                appRouter.push('/')
            } else {
                toast.error('Log Out failed')
            }
        } catch {
            toast.error('Log Out failed')
        }
    }, [appRouter, isPending, mutateAsync])
    
    if (!account) return null
    return (
        <div className='p-4 sm:p-6 md:p-8 text-white'>
            <div className='max-w-2xl mx-auto bg-tunelog-dark-alt rounded-lg shadow-md p-6'>
                <div className='flex md:flex-row flex-col md:justify-between md:items-center items-start mb-4 border-b border-gray-600 pb-2 gap-1'>
                    <h1 className='text-24-bold'>{isMyAccount ? 'My Account' : account.name}</h1>
                    <div className='flex flex-row gap-x-1'>
                        {!isMyAccount && (
                            <Button.Box text={account.followerUids?.includes(me?._id ?? '') ? 'Unfollow' : 'Follow'}/>
                        )}
                        {isMyAccount && (
                            <Button.Box text='Edit Profile' disabled/>
                        )}
                        <Button.Box text='Log Out' onClick={handleLogOut}/>
                    </div>
                </div>
                {account && (
                    <div className='space-y-4'>
                        <div>
                            <label className='text-14-semibold text-gray-400'>User ID</label>
                            <p className='text-18-regular'>{account.userid}</p>
                        </div>
                        <div>
                            <label className='text-14-semibold text-gray-400'>Name</label>
                            <p className='text-18-regular'>{account.name}</p>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div
                                className='rounded-2xl bg-tunelog-light p-2 transition duration-300 cursor-pointer active:scale-95'
                                onClick={() => {
                                    setType('following')
                                    setOpenUidDialog(true)
                                }}
                            >
                                <label className='text-14-semibold text-black'>Following</label>
                                <p className='text-18-regular text-black'>{account.followingUids?.length || 0}</p>
                            </div>
                            <div
                                className='rounded-2xl bg-tunelog-light p-2 transition duration-300 cursor-pointer active:scale-95'
                                onClick={() => {
                                    setType('follower')
                                    setOpenUidDialog(true)
                                }}
                            >
                                <label className='text-14-semibold text-black'>Followers</label>
                                <p className='text-18-regular text-black'>{account.followerUids?.length || 0}</p>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <div
                                className='rounded-2xl bg-tunelog-light p-2 transition duration-300 cursor-pointer active:scale-95'
                                onClick={() => {
                                    if (isMyAccount) appRouter.push('/ratings')
                                    //TODO. 다른 유저의 경우 처리
                                }}
                            >
                                <label className='text-14-semibold text-black'>Rating</label>
                                <p className='text-18-regular text-black'>{objectCount?.ratingCount ?? 0}</p>
                            </div>
                            <div
                                className='rounded-2xl bg-tunelog-light p-2 transition duration-300 cursor-pointer active:scale-95'
                                onClick={() => {
                                    if (isMyAccount) appRouter.push('/journals')
                                }}
                            >
                                <label className='text-14-semibold text-black'>Journal</label>
                                <p className='text-18-regular text-black'>{objectCount?.journalCount ?? 0}</p>
                            </div>
                            <div
                                className='rounded-2xl bg-tunelog-light p-2 transition duration-300 cursor-pointer active:scale-95'
                                onClick={() => {
                                    if (isMyAccount) appRouter.push('/topsters')
                                }}
                            >
                                <label className='text-14-semibold text-black'>Topster</label>
                                <p className='text-18-regular text-black'>{objectCount?.topsterCount ?? 0}</p>
                            </div>
                        </div>
                        <div className='pt-4 mt-4 border-t border-gray-700 text-12-regular text-gray-500'>
                            <p>Account created: {new Date(account.createdAt).toLocaleDateString()}</p>
                            <p>Last updated: {new Date(account.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                )}
            </div>
            <Dialogs.FollowingFollower open={openUidDialog} onCloseAction={() => setOpenUidDialog(false)} uid={account._id} type={type}/>
        </div>
    )
}