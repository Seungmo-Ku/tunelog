'use client'

import { Dialog, DialogPanel, DialogTitle, Input } from '@headlessui/react'
import React, { useCallback, useState } from 'react'
import { Rating } from '@/libs/interfaces/rating.interface'
import { Button } from '@/components/buttons'
import { isEmpty, noop } from 'lodash'
import { useDeleteRating } from '@/hooks/use-rating'
import toast from 'react-hot-toast'


export interface DialogDeleteRatingProps {
    open: boolean
    onCloseAction: () => void
    rating: Rating | null | undefined
}

export const DialogDeleteRating = ({
    open,
    onCloseAction,
    rating
}: DialogDeleteRatingProps) => {
    const [password, setPassword] = useState<string>('')
    const { mutateAsync, isPending } = useDeleteRating()
    
    const handleDelete = useCallback(async () => {
        if (!rating || isEmpty(password) || isPending) return
        try {
            const response = await mutateAsync({
                id: rating._id,
                rating: {
                    password
                }
            })
            if (response) {
                setPassword('')
                onCloseAction()
                toast.success('Rating deleted successfully.')
            } else {
                toast.error('Failed to delete rating. Please check your password and try again.')
            }
        } catch {
            toast.error('Failed to delete rating. Please check your password and try again.')
        }
    }, [isPending, mutateAsync, onCloseAction, password, rating])
    
    if (!rating) return null
    return (
        <Dialog transition open={open} onClose={onCloseAction} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 bg-black/50' aria-hidden='true'/>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                <DialogPanel className='w-3/4 space-y-4 bg-[#33373B] text-white md:p-12 p-4 rounded-2xl flex flex-col'>
                    <DialogTitle className='font-bold'>Delete Rating</DialogTitle>
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type='password'
                        placeholder='Enter password'
                        className='w-full py-1 border-white border'
                    />
                    <Button.Box
                        text='Delete Rating'
                        disabled={isEmpty(password)}
                        onClick={() => {
                            handleDelete().then(noop)
                        }}
                    />
                </DialogPanel>
            </div>
        </Dialog>
    )
}