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
import { isEmpty, noop } from 'lodash'
import { useFollowUnfollow } from '@/libs/utils/follow-unfollow'
import Calendar from 'react-calendar'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'


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
    const { i18n } = useTranslation()
    
    const [openUidDialog, setOpenUidDialog] = useState<boolean>(false)
    const [type, setType] = useState<'following' | 'follower'>('following')
    
    const { handleFollowUnfollow, isFollowingUnfollowingPending } = useFollowUnfollow(account)
    
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
    
    const isDateDisabled = useCallback((date: Date) => {
        if (!account) return true
        return date < new Date(account.createdAt) || date > new Date()
    }, [account])
    
    if (!account) return null
    return (
        <div className='p-4 sm:p-6 md:p-8 text-white'>
            <div className='max-w-2xl mx-auto bg-tunelog-dark-alt rounded-lg shadow-md p-6'>
                <div className='flex md:flex-row flex-col md:justify-between md:items-center items-start mb-4 border-b border-gray-600 pb-2 gap-1'>
                    <h1 className='text-24-bold'>{isMyAccount ? 'My Account' : account.name}</h1>
                    <div className='flex flex-row gap-x-1'>
                        {!isMyAccount && (
                            <Button.Box
                                text={me?.followingUids?.includes(account._id ?? '') ? 'Unfollow' : 'Follow'}
                                disabled={isFollowingUnfollowingPending}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleFollowUnfollow().then(noop)
                                }}
                            />
                        )}
                        {isMyAccount && (
                            <Button.Box text='Edit Profile' disabled/>
                        )}
                        {isMyAccount && (
                            <Button.Box text='Log Out' onClick={handleLogOut}/>
                        )}
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
                                    if (isEmpty(account?.followingUids)) return
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
                                    if (isEmpty(account?.followerUids)) return
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
                                    if (isMyAccount) {
                                        appRouter.push('/ratings')
                                    } else {
                                        appRouter.push(`/ratings/user/${account?._id ?? ''}`)
                                    }
                                }}
                            >
                                <label className='text-14-semibold text-black'>Rating</label>
                                <p className='text-18-regular text-black'>{objectCount?.ratingCount ?? 0}</p>
                            </div>
                            <div
                                className='rounded-2xl bg-tunelog-light p-2 transition duration-300 cursor-pointer active:scale-95'
                                onClick={() => {
                                    if (isMyAccount) {
                                        appRouter.push('/journals')
                                    } else {
                                        appRouter.push(`/journals/user/${account?._id ?? ''}`)
                                    }
                                }}
                            >
                                <label className='text-14-semibold text-black'>Journal</label>
                                <p className='text-18-regular text-black'>{objectCount?.journalCount ?? 0}</p>
                            </div>
                            <div
                                className='rounded-2xl bg-tunelog-light p-2 transition duration-300 cursor-pointer active:scale-95'
                                onClick={() => {
                                    if (isMyAccount) {
                                        appRouter.push('/topsters')
                                    } else {
                                        appRouter.push(`/topsters/user/${account?._id ?? ''}`)
                                    }
                                }}
                            >
                                <label className='text-14-semibold text-black'>Topster</label>
                                <p className='text-18-regular text-black'>{objectCount?.topsterCount ?? 0}</p>
                            </div>
                        </div>
                        <Calendar
                            locale={i18n.language}
                            maxDate={new Date()}
                            next2Label={null}
                            prev2Label={null}
                            minDetail='month'
                            className='flex flex-col'
                            tileClassName=''
                            tileDisabled={({ date }) => {
                                // Disable dates before account creation date
                                return isDateDisabled(date)
                            }}
                            tileContent={({ date }) => {
                                return (
                                    <div className={clsx(isDateDisabled(date) ? 'text-gray-500' : 'text-white', 'text-center')}>
                                        {date.toLocaleDateString()}
                                    </div>
                                )
                            }}
                        />
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