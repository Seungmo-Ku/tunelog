'use client'

import React from 'react'
import { Button } from '@/components/buttons'
import { useTranslation } from 'react-i18next'


interface FollowingButtonsProps {
    followingIndex: number
    setFollowingIndexAction: React.Dispatch<React.SetStateAction<number>>
}

export const FollowingButtons = ({
    followingIndex,
    setFollowingIndexAction
}: FollowingButtonsProps) => {
    const { t } = useTranslation()
    return (
        <div className='flex gap-x-[10px] overflow-x-auto hide-sidebar'>
            <Button.Filter text={t('keywords.all')} selected={followingIndex === 0} onClick={() => setFollowingIndexAction(0)} className='h-10'/>
            <Button.Filter text='Following' selected={followingIndex === 1} onClick={() => setFollowingIndexAction(1)} className='h-10'/>
        </div>
    )
}