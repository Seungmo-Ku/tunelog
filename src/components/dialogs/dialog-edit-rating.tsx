'use client'

import { Dialog, DialogPanel, DialogTitle, Switch } from '@headlessui/react'
import { Button } from '@/components/buttons'
import { noop } from 'lodash'
import React, { useCallback, useEffect } from 'react'
import { Rating } from '@/libs/interfaces/rating.interface'
import { useEditRating } from '@/hooks/use-rating'
import toast from 'react-hot-toast'


interface DialogEditRatingProps {
    open: boolean
    onCloseAction: () => void
    rating: Rating | null | undefined
}

export const DialogEditRating = ({
    open,
    onCloseAction,
    rating
}: DialogEditRatingProps) => {
    const { mutateAsync, isPending } = useEditRating()
    const [isPublic, setIsPublic] = React.useState<boolean>(false)
    
    useEffect(() => {
        if (!rating) return
        setIsPublic(rating?.public ?? false)
    }, [rating])
    
    const handleUpdate = useCallback(async () => {
        if (!rating || isPending) return
        try {
            const res = await mutateAsync({
                id: rating._id,
                rating: {
                    public: isPublic
                }
            })
            if (res) {
                toast.success(`Rating updated successfully`)
            } else {
                toast.error(`Failed to update rating`)
            }
            onCloseAction()
        } catch {
            toast.error(`Failed to update rating`)
        }
    }, [isPending, isPublic, mutateAsync, onCloseAction, rating])
    return (
        <Dialog transition open={open} onClose={onCloseAction} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 bg-black/50' aria-hidden='true'/>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                <DialogPanel className='w-3/4 space-y-4 bg-[#33373B] text-white md:p-12 p-4 rounded-2xl flex flex-col'>
                    <DialogTitle className='font-bold'>{`Edit Rating`}</DialogTitle>
                    <div className='flex flex-col gap-y-2'>
                        <p className='text-white'>{isPublic ? 'Public rating (visible to everyone)' : 'Private rating (only visible to you)'}</p>
                        <Switch
                            checked={isPublic}
                            onChange={setIsPublic}
                            className='group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white shrink-0'
                        >
                            <span
                                aria-hidden='true'
                                className='pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7'
                            />
                        </Switch>
                    </div>
                    <Button.Box
                        disabled={!rating || isPending}
                        text={`Update Rating`}
                        onClick={() => {
                            handleUpdate().then(noop)
                        }}
                    />
                </DialogPanel>
            </div>
        </Dialog>
    )
}