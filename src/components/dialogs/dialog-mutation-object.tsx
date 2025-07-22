'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import React, { useCallback, useMemo } from 'react'
import { Rating } from '@/libs/interfaces/rating.interface'
import { Button } from '@/components/buttons'
import { noop } from 'lodash'
import { useDeleteRating } from '@/hooks/use-rating'
import toast from 'react-hot-toast'
import { Journal } from '@/libs/interfaces/journal.interface'
import { Topster } from '@/libs/interfaces/topster.interface'
import { useDeleteJournal, useUpdateJournal } from '@/hooks/use-journal'
import { useRouter } from 'next/navigation'
import { useDeleteTopster, useUpdateTopster } from '@/hooks/use-topster'
import { TopsterUpdateRequest } from '@/libs/dto/topster.dto'
import { JournalUpdateRequest } from '@/libs/dto/journal.dto'
import { useTranslation } from 'react-i18next'


export interface DialogMutationObjectProps {
    open: boolean
    onCloseAction: () => void
    object: Rating | Journal | Topster | null | undefined
    type?: 'rating' | 'journal' | 'topster'
    action?: 'delete' | 'update'
    updateObject?: TopsterUpdateRequest | JournalUpdateRequest | null | undefined
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
    
    const { mutateAsync: deleteRating, isPending: isRatingPending } = useDeleteRating()
    const { mutateAsync: deleteJournal, isPending: isJournalPending } = useDeleteJournal()
    const { mutateAsync: deleteTopster, isPending: isTopsterPending } = useDeleteTopster()
    
    const { mutateAsync: updateTopster, isPending: isTopsterUpdatePending } = useUpdateTopster()
    const { mutateAsync: updateJournal, isPending: isJournalUpdatePending } = useUpdateJournal()
    
    const { t } = useTranslation()
    
    const isPending = useMemo(() => isRatingPending || isJournalPending || isTopsterPending || isTopsterUpdatePending || isJournalUpdatePending,
        [isRatingPending, isJournalPending, isTopsterPending, isTopsterUpdatePending, isJournalUpdatePending])
    
    const handleDelete = useCallback(async () => {
        if (!object || isPending) return
        try {
            let response
            switch (type) {
                case 'rating':
                    response = await deleteRating(object._id)
                    break
                case 'journal':
                    response = await deleteJournal(object._id)
                    break
                case 'topster':
                    response = await deleteTopster(object._id)
                    break
            }
            if (response) {
                onCloseAction()
                toast.success(t('mutation_object.deletion_success', { type: t(`keywords.${type}`).toLowerCase() }))
                if (type === 'journal' || type === 'topster') {
                    appRouter.back()
                }
            } else {
                toast.error(t('mutation_object.deletion_error', { type: t(`keywords.${type}`).toLowerCase() }))
            }
        } catch {
            toast.error(t('mutation_object.deletion_error', { type: t(`keywords.${type}`).toLowerCase() }))
        }
    }, [object, isPending, type, deleteRating, deleteJournal, deleteTopster, onCloseAction, appRouter, t])
    
    const handleUpdate = useCallback(async () => {
        if (!object || isPending || !updateObject) return
        try {
            let response
            switch (type) {
                case 'journal':
                    response = await updateJournal({
                        id: object._id,
                        journal: {
                            ...updateObject
                        }
                    })
                    break
                case 'topster':
                    response = await updateTopster({
                        id: object._id,
                        topster: {
                            ...updateObject
                        }
                    })
                    break
            }
            if (response) {
                onCloseAction()
                toast.success(t('mutation_object.update_success', { type: t(`keywords.${type}`).toLowerCase() }))
                if (type === 'journal' || type === 'topster') {
                    appRouter.back()
                }
            } else {
                toast.error(t('mutation_object.update_error', { type: t(`keywords.${type}`).toLowerCase() }))
            }
        } catch {
            toast.error(t('mutation_object.update_error', { type: t(`keywords.${type}`).toLowerCase() }))
        }
    }, [object, isPending, updateObject, type, updateJournal, updateTopster, onCloseAction, t, appRouter])
    
    if (!object) return null
    return (
        <Dialog transition open={open} onClose={onCloseAction} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 bg-black/50' aria-hidden='true'/>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                <DialogPanel className='w-3/4 space-y-4 bg-[#33373B] text-white md:p-12 p-4 rounded-2xl flex flex-col'>
                    <DialogTitle className='font-bold'>{`${t('mutation_object.action', { action: t(`keywords.${action}`), type: t(`keywords.${type}`) })}`}</DialogTitle>
                    <p>{t('mutation_object.description', { action: t(`keywords.${action}`).toLowerCase(), type: t(`keywords.${type}`).toLowerCase() })}</p>
                    <Button.Box
                        text={`${t('mutation_object.action', { action: t(`keywords.${action}`), type: t(`keywords.${type}`) })}`}
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