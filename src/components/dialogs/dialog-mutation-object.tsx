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
import { useDeleteJournal, useUpdateJournal } from '@/hooks/use-journal'
import { useRouter } from 'next/navigation'
import { capitalizeFirstLetter } from '@/libs/utils/string'
import { useDeleteTopster, useUpdateTopster } from '@/hooks/use-topster'
import { TopsterUpdateRequest } from '@/libs/dto/topster.dto'
import { JournalUpdateRequest } from '@/libs/dto/journal.dto'


export interface DialogMutationObjectProps {
    open: boolean
    onCloseAction: () => void
    object: Rating | Journal | Topster | null | undefined
    type?: 'rating' | 'journal' | 'topster'
    action?: 'delete' | 'update'
    updateObject?: Omit<TopsterUpdateRequest, 'password'> | Omit<JournalUpdateRequest, 'password'> | null | undefined
}

export const DialogMutationObject = ({
    open,
    onCloseAction,
    object,
    type = 'rating',
    action = 'delete',
    updateObject = null
}: DialogMutationObjectProps) => {
    
    const appRouter = useRouter()
    const [password, setPassword] = useState<string>('')
    
    const { mutateAsync: deleteRating, isPending: isRatingPending } = useDeleteRating()
    const { mutateAsync: deleteJournal, isPending: isJournalPending } = useDeleteJournal()
    const { mutateAsync: deleteTopster, isPending: isTopsterPending } = useDeleteTopster()
    
    const { mutateAsync: updateTopster, isPending: isTopsterUpdatePending } = useUpdateTopster()
    const { mutateAsync: updateJournal, isPending: isJournalUpdatePending } = useUpdateJournal()
    
    const isPending = useMemo(() => isRatingPending || isJournalPending || isTopsterPending || isTopsterUpdatePending || isJournalUpdatePending,
        [isRatingPending, isJournalPending, isTopsterPending, isTopsterUpdatePending, isJournalUpdatePending])
    
    const handleDelete = useCallback(async () => {
        if (!object || isEmpty(password) || isPending) return
        try {
            let response
            switch (type) {
                case 'rating':
                    response = await deleteRating({
                        id: object._id,
                        rating: {
                            password
                        }
                    })
                    break
                case 'journal':
                    response = await deleteJournal({
                        id: object._id,
                        journal: {
                            password
                        }
                    })
                    break
                case 'topster':
                    response = await deleteTopster({
                        id: object._id,
                        topster: {
                            password
                        }
                    })
                    break
            }
            if (response) {
                setPassword('')
                onCloseAction()
                toast.success(`${type} deleted successfully.`)
                if (type === 'journal' || type === 'topster') {
                    appRouter.back()
                }
            } else {
                toast.error(`Failed to delete ${type}. Please check your password and try again.`)
            }
        } catch {
            toast.error(`Failed to delete ${type}. Please check your password and try again.`)
        }
    }, [object, password, isPending, type, deleteRating, deleteJournal, deleteTopster, onCloseAction, appRouter])
    
    const handleUpdate = useCallback(async () => {
        if (!object || isEmpty(password) || isPending || !updateObject) return
        try {
            let response
            switch (type) {
                case 'journal':
                    response = await updateJournal({
                        id: object._id,
                        journal: {
                            ...updateObject,
                            password
                        }
                    })
                    break
                case 'topster':
                    response = await updateTopster({
                        id: object._id,
                        topster: {
                            ...updateObject,
                            password
                        }
                    })
                    break
            }
            if (response) {
                setPassword('')
                onCloseAction()
                toast.success(`Updated ${type} successfully.`)
                if (type === 'journal' || type === 'topster') {
                    appRouter.back()
                }
            } else {
                toast.error(`Failed to update ${type}. Please check your password and try again.`)
            }
        } catch {
            toast.error(`Failed to update ${type}. Please check your password and try again.`)
        }
    }, [object, password, isPending, updateObject, type, updateJournal, updateTopster, onCloseAction, appRouter])
    
    if (!object) return null
    return (
        <Dialog transition open={open} onClose={onCloseAction} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 bg-black/50' aria-hidden='true'/>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                <DialogPanel className='w-3/4 space-y-4 bg-[#33373B] text-white md:p-12 p-4 rounded-2xl flex flex-col'>
                    <DialogTitle className='font-bold'>{`${capitalizeFirstLetter(action)} ${capitalizeFirstLetter(type)}`}</DialogTitle>
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type='password'
                        placeholder='Enter password'
                        className='w-full py-1 border-white border'
                    />
                    <Button.Box
                        text={`${capitalizeFirstLetter(action)} ${capitalizeFirstLetter(type)}`}
                        disabled={isEmpty(password)}
                        onClick={() => {
                            if (action === 'delete') handleDelete().then(noop)
                            handleUpdate().then(noop)
                        }}
                    />
                </DialogPanel>
            </div>
        </Dialog>
    )
}