'use client'

import { clsx } from 'clsx'
import Calendar from 'react-calendar'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Account } from '@/libs/interfaces/account.interface'


export interface ActivityCalendarProps {
    account: Account | null | undefined
    isMyAccount: boolean
}

export const ActivityCalendar = ({
    account,
    isMyAccount = false
}: ActivityCalendarProps) => {
    
    const { i18n } = useTranslation()
    
    const isDateDisabled = useCallback((date: Date) => {
        if (!account) return true
        return date < new Date(account.createdAt) || date > new Date()
    }, [account])
    
    console.log('Rendering ActivityCalendar', account?.name, isMyAccount)
    
    return (
        <Calendar
            locale={i18n.language}
            next2Label={null}
            prev2Label={null}
            minDetail='month'
            className='flex flex-col'
            tileClassName=''
            tileDisabled={({ date }) => {
                return isDateDisabled(date)
            }}
            tileContent={({ date }) => {
                return (
                    <div className={clsx('text-center', isDateDisabled(date) ? 'text-gray-500' : 'text-white')}>
                        {date.toLocaleDateString()}
                    </div>
                )
            }}
        />
    )
}