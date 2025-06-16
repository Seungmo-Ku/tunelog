'use client'

import React from 'react'
import { Button } from '@/components/buttons'


interface FilterButtonsProps {
    filterIndex: number
    setFilterIndexAction: React.Dispatch<React.SetStateAction<number>>
}

export const FilterButtons = ({
    filterIndex,
    setFilterIndexAction
}: FilterButtonsProps) => {
    
    return (
        <div className='flex gap-x-[10px] overflow-x-scroll'>
            <Button.Filter text='All' selected={filterIndex === 0} onClick={() => setFilterIndexAction(0)}/>
            <Button.Filter text='Album' selected={filterIndex === 1} onClick={() => setFilterIndexAction(1)}/>
            <Button.Filter text='Artist' selected={filterIndex === 2} onClick={() => setFilterIndexAction(2)}/>
            <Button.Filter text='Track' selected={filterIndex === 3} onClick={() => setFilterIndexAction(3)}/>
        </div>
    )
}