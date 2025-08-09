'use client'

import { Dialog, DialogPanel, DialogTitle, Input } from '@headlessui/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { atom, useAtom } from 'jotai'
import { useGetReplies, usePostReply } from '@/hooks/use-reply'
import { useInView } from 'react-intersection-observer'
import { Reply } from '@/libs/interfaces/rating.interface'
import { Cards } from '@/components/cards'
import { Button } from '@/components/buttons'
import { isEmpty } from 'lodash'
import toast from 'react-hot-toast'
import { useAccount } from '@/libs/utils/account'
import { AccountStatus } from '@/libs/constants/account.constant'


interface DialogCommentProps {
    open: boolean,
    type: 'rating' | 'journal' | 'topster' | null,
    id: string | null
}

export const DialogCommentAtom = atom<DialogCommentProps>({
    open: false,
    type: null,
    id: null
})

export const DialogComment = ({}) => {
    
    const [dialogOpen, setDialogOpen] = useAtom(DialogCommentAtom)
    const { status, me } = useAccount()
    const { open, type, id } = dialogOpen
    
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetReplies(type, id ?? '', 3)
    const replies = useMemo(() => {
        if (isLoading) return []
        const repliesArray = data?.pages.flatMap(page => page.data) ?? []
        return repliesArray?.map(reply => new Reply(reply)) ?? []
    }, [data?.pages, isLoading])
    const { mutateAsync, isPending } = usePostReply()
    
    const [comment, setComment] = useState<string>('')
    
    const { ref, inView } = useInView()
    
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage])
    
    useEffect(() => {
        if (open && type && id) {
            setComment('')
        }
    }, [id, open, type])
    
    const onClose = useCallback(() => {
        setDialogOpen((prev) => ({
            ...prev,
            open: false
        }))
    }, [setDialogOpen])
    
    const handleClick = useCallback(async () => {
        if (isEmpty(comment) || isPending || !type || !id) return
        if (status === AccountStatus.guest) {
            toast.error('You must be logged in to post a comment')
            return
        }
        try {
            const res = await mutateAsync({
                type,
                id,
                reply: {
                    comment,
                    author: me?.name ?? ''
                }
            })
            if (res) {
                setComment('')
                toast.success('Comment posted successfully')
            } else {
                toast.error('Failed to post comment')
            }
        } catch {
            toast.error('Failed to post comment')
        }
    }, [comment, id, isPending, me?.name, mutateAsync, status, type])
    
    return (
        <Dialog transition open={open} onClose={onClose} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50'>
                <DialogPanel className='w-5/6 h-1/2 space-y-4 bg-[#33373B] text-white md:p-12 p-4 rounded-2xl flex flex-col relative'>
                    <DialogTitle className='font-bold'>Comments</DialogTitle>
                    <div className='flex flex-col text-white overflow-y-auto hide-sidebar grow'>
                        {
                            replies.map((reply, index) => (
                                <Cards.Comment reply={reply} key={`reply-${reply.uid}-${index}`}/>
                            ))
                        }
                        <div ref={ref}></div>
                    </div>
                    <div className='flex flex-row items-center w-full gap-x-2'>
                        <Input
                            className='rounded-lg bg-[#44474B] text-white placeholder:text-gray-400 focus:ring-0 focus:border-tunelog-blue p-1 grow'
                            placeholder='Write a comment...'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button.Box
                            text='Post'
                            disabled={isEmpty(comment) || isPending}
                            onClick={handleClick}
                        />
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}