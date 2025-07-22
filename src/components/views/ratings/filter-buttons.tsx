'use client'

import React from 'react'
import { Button } from '@/components/buttons'
import { useTranslation } from 'react-i18next'


interface FilterButtonsProps {
    filterIndex: number
    setFilterIndexAction: React.Dispatch<React.SetStateAction<number>>
    type?: 'community' | 'ratings'
}

export const FilterButtons = ({
    filterIndex,
    setFilterIndexAction,
    type = 'ratings'
}: FilterButtonsProps) => {
    const { t } = useTranslation()
    return (
        <div className='flex gap-x-[10px] overflow-x-auto hide-sidebar'>
            <Button.Filter text={t('keywords.all')} selected={filterIndex === 0} onClick={() => setFilterIndexAction(0)} className='h-10'/>
            <Button.Filter text={type === 'ratings' ? t('keywords.album') : t('keywords.rating')} selected={filterIndex === 1} onClick={() => setFilterIndexAction(1)} className='h-10'/>
            <Button.Filter text={type === 'ratings' ? t('keywords.artist') : t('keywords.journal')} selected={filterIndex === 2} onClick={() => setFilterIndexAction(2)} className='h-10'/>
            <Button.Filter text={type === 'ratings' ? t('keywords.track') : t('keywords.topster')} selected={filterIndex === 3} onClick={() => setFilterIndexAction(3)} className='h-10'/>
        </div>
    )
}