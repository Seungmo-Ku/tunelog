'use client'

import { Dialog, DialogPanel, DialogTitle, Input } from '@headlessui/react'
import React, { useCallback, useMemo, useState } from 'react'
import { Rating } from '@/libs/interfaces/rating.interface'
import { Button } from '@/components/buttons'
import { isEmpty, noop } from 'lodash'
import { useDeleteRating } from '@/hooks/use-rating'
import toast from 'react-hot-toast'
import { Journal } from '@/libs/interfaces/journal.interface'
import { Topster } from '@/libs/interfaces/topster.interface'
import { useDeleteJournal } from '@/hooks/use-journal'
import { useRouter } from 'next/navigation'


export interface DialogDeleteObjectProps {
    open: boolean
    onCloseAction: () => void
    object: Rating | Journal | Topster | null | undefined
    type?: 'rating' | 'journal' | 'topster'
}

export const DialogDeleteObject = ({
    open,
    onCloseAction,
    object,
    type = 'rating'
}: DialogDeleteObjectProps) => {
    
    const appRouter = useRouter()
    const [password, setPassword] = useState<string>('')
    const { mutateAsync: deleteRating, isPending: isRatingPending } = useDeleteRating()
    const { mutateAsync: deleteJournal, isPending: isJournalPending } = useDeleteJournal()
    
    const isPending = useMemo(() => isRatingPending || isJournalPending, [isRatingPending, isJournalPending])
    
    const handleDelete = useCallback(async () => {
        if (!object || isEmpty(password) || isPending) return
        try {
            let response
            if (type === 'rating') {
                response = await deleteRating({
                    id: object._id,
                    rating: {
                        password
                    }
                })
            } else {
                response = await deleteJournal({
                    id: object._id,
                    journal: {
                        password
                    }
                })
            }
            if (response) {
                setPassword('')
                onCloseAction()
                toast.success(`${type} deleted successfully.`)
                if (type === 'journal') {
                    appRouter.back()
                }
            } else {
                toast.error(`Failed to delete ${type}. Please check your password and try again.`)
            }
        } catch {
            toast.error(`Failed to delete ${type}. Please check your password and try again.`)
        }
    }, [object, password, isPending, type, deleteRating, deleteJournal, onCloseAction, appRouter])
    
    if (!object) return null
    return (
        <Dialog transition open={open} onClose={onCloseAction} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 bg-black/50' aria-hidden='true'/>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                <DialogPanel className='w-3/4 space-y-4 bg-[#33373B] text-white md:p-12 p-4 rounded-2xl flex flex-col'>
                    <DialogTitle className='font-bold'>{`Delete ${type}`}</DialogTitle>
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type='password'
                        placeholder='Enter password'
                        className='w-full py-1 border-white border'
                    />
                    <Button.Box
                        text={`Delete ${type}`}
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