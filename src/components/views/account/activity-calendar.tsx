'use client'

import { clsx } from 'clsx'
import Calendar from 'react-calendar'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Account } from '@/libs/interfaces/account.interface'
import { useGetCommunityItems } from '@/hooks/use-community'
import { CommunityItem } from '@/libs/interfaces/community.interface'
import { IRating, Rating } from '@/libs/interfaces/rating.interface'
import { IJournal, Journal } from '@/libs/interfaces/journal.interface'
import { ITopster, Topster } from '@/libs/interfaces/topster.interface'
import { ActivityCalendarImages } from '@/components/views/account/activity-calendar-images'


export interface ActivityCalendarProps {
    account: Account | null | undefined
}

export const ActivityCalendar = ({
    account
}: ActivityCalendarProps) => {
    
    const [month, setMonth] = useState<Date>(new Date())
    
    const { i18n } = useTranslation()
    
    const monthFormat = useMemo(() => {
        const selectedMonth = month.getMonth() + 1
        const year = month.getFullYear()
        return `${year}-${selectedMonth < 10 ? '0' + selectedMonth : selectedMonth}`
    }, [month])
    
    const { data: communityItemsData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetCommunityItems(10, 'all', 'oldest', 'all', account?._id ?? '', monthFormat)
    
    const communityItems: CommunityItem[] = useMemo(() => {
        if (isLoading) return []
        const itemsArray = communityItemsData?.pages.flatMap(page => page.data) ?? []
        return itemsArray.map(response => {
            switch (response.itemType) {
                case 'rating':
                    return {
                        type: 'rating',
                        item: new Rating(response.item as IRating)
                    }
                case 'journal':
                    return {
                        type: 'journal',
                        item: new Journal(response.item as IJournal)
                    }
                case 'topster':
                default:
                    return {
                        type: 'topster',
                        item: new Topster(response.item as ITopster)
                    }
            }
        })
    }, [communityItemsData?.pages, isLoading])
    
    useEffect(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage])
    
    const groupedByMonth = useMemo(() => {
        return communityItems.reduce((acc, curr) => {
            const monthKey = new Date(curr.item?.createdAt ?? '')
                .toISOString()
                .slice(0, 10)
            
            if (!acc[monthKey]) {
                acc[monthKey] = []
            }
            
            acc[monthKey].push(curr)
            return acc
        }, {} as Record<string, typeof communityItems>)
    }, [communityItems])
    
    const isDateDisabled = useCallback((date: Date) => {
        if (!account) return true
        return date < new Date(account.createdAt) || date > new Date()
    }, [account])
    
    return (
        <Calendar
            locale={i18n.language}
            next2Label={null}
            prev2Label={null}
            minDetail='month'
            className='flex flex-col'
            tileClassName=''
            activeStartDate={month}
            onActiveStartDateChange={({ activeStartDate }) => {
                setMonth(activeStartDate || new Date())
            }}
            tileDisabled={({ date }) => {
                return isDateDisabled(date)
            }}
            tileContent={({ date }) => {
                const dayKey = date.toISOString().slice(0, 10)
                const itemsForDay = groupedByMonth[dayKey] || []
                return (
                    <div className={clsx('flex flex-col items-center justify-start overflow-hidden md:min-h-[120px] min-h-[80px]', isDateDisabled(date) ? 'text-gray-500' : 'text-white')}>
                        {date.getDate()}
                        {
                            itemsForDay.length > 0 && (
                                <div className='aspect-square p-1 shrink-0'>
                                    <ActivityCalendarImages item={itemsForDay[0]}/>
                                </div>
                            )
                        }
                    </div>
                )
            }}
        />
    )
}