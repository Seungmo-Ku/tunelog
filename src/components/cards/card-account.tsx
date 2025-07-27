'use client'

import { Account } from '@/libs/interfaces/account.interface'
import { Button } from '@/components/buttons'
import { useHandleLogout } from '@/hooks/use-account'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'


interface CardAccountProps {
    account: Account | null | undefined
    isMyAccount?: boolean
}

export const CardAccount = ({
    account,
    isMyAccount = false
}: CardAccountProps) => {
    const { mutateAsync, isPending } = useHandleLogout()
    const appRouter = useRouter()
    
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
                            <Button.Box text='Follow'/>
                        )}
                        {isMyAccount && (
                            <Button.Box text='Edit Profile' onClick={() => console.log('Edit Profile Clicked')}/>
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
                            <div>
                                <label className='text-14-semibold text-gray-400'>Following</label>
                                <p className='text-18-regular'>{account.followingUids?.length || 0}</p>
                            </div>
                            <div>
                                <label className='text-14-semibold text-gray-400'>Followers</label>
                                <p className='text-18-regular'>{account.followerUids?.length || 0}</p>
                            </div>
                        </div>
                        <div className='pt-4 mt-4 border-t border-gray-700 text-12-regular text-gray-500'>
                            <p>Account created: {new Date(account.createdAt).toLocaleDateString()}</p>
                            <p>Last updated: {new Date(account.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}