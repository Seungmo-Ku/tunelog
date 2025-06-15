'use client'

import React from 'react'
import { Button } from '@/components/buttons'

interface SortingButtonsProps {
    sortingIndex: number
    setSortingIndexAction: React.Dispatch<React.SetStateAction<number>>
}
export const SortingButtons = ({
    sortingIndex,
    setSortingIndexAction
}: SortingButtonsProps) => {
    
    return (
        <div className='flex gap-x-[10px]'>
            <Button.Filter text='Newest' selected={sortingIndex === 0} onClick={() => setSortingIndexAction(0)}/>
            <Button.Filter text='Oldest' selected={sortingIndex === 1} onClick={() => setSortingIndexAction(1)}/>
        </div>
    )
}