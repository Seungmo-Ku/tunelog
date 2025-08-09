'use client'

import React from 'react'
import { Reply } from '@/libs/interfaces/rating.interface'
import { useRouter } from 'next/navigation'
import { useSetAtom } from 'jotai/index'
import { DialogCommentAtom } from '@/components/dialogs/dialog-comment'
import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { EllipsisVertical } from 'lucide-react'


interface CardCommentProps {
    reply: Reply | null | undefined
}

export const CardComment = ({
    reply,
    ...props
}: CardCommentProps) => {
    const appRouter = useRouter()
    // const { me } = useAccount()
    const setDialogOpen = useSetAtom(DialogCommentAtom)
    
    // const isMyReply = useMemo(() => {
    //     if (!me || !reply) return false
    //     return me?._id === reply?.uid
    // }, [me, reply])
    
    if (!reply) return null
    
    return (
        <Menu>
            <MenuButton
                {...props}
                className='p-2 w-full rounded-[10px] cursor-pointer flex justify-between items-center'
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                }}>
                <div className='flex flex-col w-full items-start'>
                    <div className='flex items-center gap-x-1'>
                        <div className='text-14-semibold'>{reply.author}</div>
                        <div className='text-12-regular text-gray-400'>{new Date(reply.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className='mt-1 text-14-regular'>{reply.comment}</div>
                </div>
                <EllipsisVertical className='text-white w-5 h-5'/>
            </MenuButton>
            <MenuItems transition anchor='bottom end' className='bg-tunelog-dark-alt border border-white/50 rounded-2xl p-4 flex flex-col gap-y-2 transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0 z-[5]'>
                <div className='w-full flex flex-col gap-y-1 items-start text-white cursor-pointer' onClick={() => {
                    setDialogOpen((prev) => ({
                        ...prev,
                        open: false
                    }))
                    appRouter.push(`/account/${reply.uid}`)
                }}>
                    Visit Profile
                </div>
            </MenuItems>
        </Menu>
    )
}