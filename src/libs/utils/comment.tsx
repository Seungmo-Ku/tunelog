'use client'

import React, { useMemo } from 'react'
import { Button } from '@/components/buttons'
import { DialogCommentAtom } from '@/components/dialogs/dialog-comment'
import { useSetAtom } from 'jotai/index'
import { MessageCircle } from 'lucide-react'


export const useComment = () => {
    
    const setOpenCommentDialog = useSetAtom(DialogCommentAtom)
    
    
    const messageIcon = useMemo(() => {
        return <MessageCircle className='w-5 h-5 shrink-0 fill-none'/>
    }, [])
    
    
    const commentButton = useMemo(() => {
        return (
            <Button.Box
                text='Comments'
                onClick={() => setOpenCommentDialog((prev) => ({ ...prev, open: true }))}
                rightIcon={messageIcon}
            />
        )
    }, [messageIcon, setOpenCommentDialog])
    
    return {
        commentButton
    }
}