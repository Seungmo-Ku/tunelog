'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import React, { useCallback } from 'react'
import { atom, useAtom } from 'jotai'


interface DialogCommentProps {
    open: boolean
}

export const DialogCommentAtom = atom<DialogCommentProps>({ open: false })

export const DialogComment = ({}) => {
    
    const [dialogOpen, setDialogOpen] = useAtom(DialogCommentAtom)
    
    const { open } = dialogOpen
    const onClose = useCallback(() => {
        setDialogOpen((prev) => ({
            ...prev,
            open: false
        }))
    }, [setDialogOpen])
    
    return (
        <Dialog transition open={open} onClose={onClose} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50'>
                <DialogPanel className='w-5/6 space-y-4 bg-[#33373B] text-white md:p-12 p-4 rounded-2xl flex flex-col'>
                    <DialogTitle className='font-bold'>Comments</DialogTitle>
                    <div className='flex flex-col gap-y-2 text-white'>
                        comments
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}