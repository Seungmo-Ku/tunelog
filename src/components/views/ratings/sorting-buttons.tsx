'use client'

import React from 'react'
import { Button } from '@/components/buttons'
import { useTranslation } from 'react-i18next'

interface SortingButtonsProps {
    sortingIndex: number
    setSortingIndexAction: React.Dispatch<React.SetStateAction<number>>
}
export const SortingButtons = ({
    sortingIndex,
    setSortingIndexAction
}: SortingButtonsProps) => {
    const { t } = useTranslation()
    return (
        <div className='flex gap-x-[10px] md:w-fit overflow-x-auto hide-sidebar'>
            <Button.Filter text={t('keywords.newest')} selected={sortingIndex === 0} onClick={() => setSortingIndexAction(0)} className='h-10'/>
            <Button.Filter text={t('keywords.oldest')} selected={sortingIndex === 1} onClick={() => setSortingIndexAction(1)} className='h-10'/>
        </div>
    )
}