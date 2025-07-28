'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import React from 'react'
import { capitalizeFirstLetter } from '@/libs/utils/string'
import { isEmpty } from 'lodash'


interface DialogFollowingFollowerProps {
    open: boolean
    onCloseAction: () => void
    uids: string[]
    type: 'following' | 'follower'
}

export const DialogFollowingFollower = ({
    open,
    onCloseAction,
    uids,
    type
}: DialogFollowingFollowerProps) => {
    
    return (
        <Dialog transition open={open} onClose={onCloseAction} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 bg-black/50' aria-hidden='true'/>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                <DialogPanel className='w-3/4 space-y-4 bg-[#33373B] text-white md:p-12 p-4 rounded-2xl flex flex-col'>
                    <DialogTitle className='font-bold'>{capitalizeFirstLetter(type)}</DialogTitle>
                    <div className='flex flex-col gap-y-2'>
                        {
                            !isEmpty(uids) ? (
                                uids.map((uid) => (
                                    <p key={uid} className='text-white'>{uid}</p>
                                ))
                            ) : (
                                <p className='text-white'>No {type} found.</p>
                            )
                        }
                        {/*
                         카드 목록
                         */}
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}