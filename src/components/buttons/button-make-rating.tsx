'use client'

import { Button } from '@/components/buttons/index'
import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { SearchType } from '@/libs/constants/spotify.constant'
import { Plus } from 'lucide-react'
import { useSetAtom, atom } from 'jotai'


interface ButtonMakeRatingProps {
    id: string | null | undefined,
    type: SearchType
}

export const MakeRatingAtom = atom<boolean>(false)
export const ButtonMakeRating = ({
    id,
    type
}: ButtonMakeRatingProps) => {
    const appRouter = useRouter()
    const setMakeRating = useSetAtom(MakeRatingAtom)
    
    const plusComponent = useMemo(() => <Plus className='text-tunelog-secondary w-5 h-5'/>, [])
    if (!id || !type) {
        return null
    }
    return (
        <Button.Box
            text='Make Rating'
            leftIcon={plusComponent}
            onClick={() => {
                setMakeRating(true)
                appRouter.push(`/ratings#initialSelectedObjectId=${id}&initialSelectedType=${type}`)
            }}
        />
    )
}