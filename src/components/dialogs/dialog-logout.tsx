'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Button } from '@/components/buttons'
import React, { useCallback, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { useHandleLogout } from '@/hooks/use-account'
import toast from 'react-hot-toast'
import { useAccount } from '@/libs/utils/account'
import { AccountStatus } from '@/libs/constants/account.constant'


export interface DialogLogoutProps {
    open: boolean
}

export const DialogLogoutAtom = atom<DialogLogoutProps>({
    open: false
})

export const DialogLogout = () => {
    const { mutateAsync, isPending } = useHandleLogout()
    const [dialogLogout, setDialogLogout] = useAtom(DialogLogoutAtom)
    const { open } = dialogLogout
    const { status, me } = useAccount()
    
    const onClose = useCallback(() => {
        setDialogLogout((prev) => (
            { ...prev, open: false }
        ))
    }, [setDialogLogout])
    
    useEffect(() => {
        if (status === AccountStatus.guest) {
            onClose()
        }
    }, [onClose, status])
    
    const handleLogOut = useCallback(async () => {
        if (isPending) return
        try {
            const response = await mutateAsync()
            if (response) {
                toast.success('Log Out successful')
                onClose()
            } else {
                toast.error('Log Out failed')
            }
        } catch {
            toast.error('Log Out failed')
        }
    }, [isPending, mutateAsync, onClose])
    
    return (
        <Dialog transition open={open} onClose={onClose} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50'>
                <DialogPanel className='w-3/4 space-y-4 bg-[#33373B] text-white md:p-12 p-4 rounded-2xl flex flex-col'>
                    <DialogTitle className='font-bold'>Account Info</DialogTitle>
                    <div className='flex flex-col gap-y-2 text-white'>
                        <span>{`Account Id: ${me?.userid ?? ''}`}</span>
                        <span>{`Name: ${me?.name ?? ''}`}</span>
                        <span>{`Created At ${new Date(me?.createdAt ?? 0).toLocaleDateString()}`}</span>
                    </div>
                    <Button.Box
                        text='Log Out'
                        onClick={handleLogOut}
                    />
                </DialogPanel>
            </div>
        </Dialog>
    )
}