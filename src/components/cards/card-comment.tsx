'use client'

import React from 'react'
import { Reply } from '@/libs/interfaces/rating.interface'
import { useRouter } from 'next/navigation'
import { useSetAtom } from 'jotai/index'
import { DialogCommentAtom } from '@/components/dialogs/dialog-comment'


interface CardCommentProps {
    reply: Reply | null | undefined
}

export const CardComment = ({
    reply,
    ...props
}: CardCommentProps) => {
    const appRouter = useRouter()
    const setDialogOpen = useSetAtom(DialogCommentAtom)
    if (!reply) return null
    return (
        <div
            {...props}
            className='p-2 w-full rounded-[10px] cursor-pointer transition active:scale-[0.98] active:bg-tunelog-dark-alt'
            onClick={() => {
                setDialogOpen((prev) => ({
                    ...prev,
                    open: false
                }))
                appRouter.push(`/account/${reply.uid}`)
            }}
        >
            <div className='flex items-center gap-x-1'>
                <div className='text-14-semibold'>{reply.author}</div>
                <div className='text-12-regular text-gray-400'>{new Date(reply.createdAt).toLocaleDateString()}</div>
            </div>
            <div className='mt-1 text-14-regular'>{reply.comment}</div>
        </div>
    )
}