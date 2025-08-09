'use client'

import React, { useMemo } from 'react'
import { Button } from '@/components/buttons'
import { DialogCommentAtom } from '@/components/dialogs/dialog-comment'
import { useSetAtom } from 'jotai/index'
import { MessageCircle } from 'lucide-react'

interface useCommentProps {
    type: 'rating' | 'topster' | 'journal'
    id: string
}

export const useComment = ({
    type,
    id
}: useCommentProps) => {
    
    const setOpenCommentDialog = useSetAtom(DialogCommentAtom)
    
    
    const messageIcon = useMemo(() => {
        return <MessageCircle className='w-5 h-5 shrink-0 fill-none'/>
    }, [])
    
    
    const commentButton = useMemo(() => {
        return (
            <Button.Box
                text='Comments'
                onClick={() => setOpenCommentDialog((prev) => ({
                    ...prev,
                    open: true,
                    type,
                    id
                }))}
                rightIcon={messageIcon}
            />
        )
    }, [id, messageIcon, setOpenCommentDialog, type])
    
    return {
        commentButton
    }
}