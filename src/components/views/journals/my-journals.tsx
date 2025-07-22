'use client'

import { Cards } from '@/components/cards'
import { useGetMyJournals } from '@/hooks/use-journal'
import { useEffect, useMemo } from 'react'
import { Journal, JournalByMonth } from '@/libs/interfaces/journal.interface'
import { useInView } from 'react-intersection-observer'
import { useJournalWithObjects } from '@/hooks/use-journal-with-objects'
import { isEmpty } from 'lodash'
import { Album, Artist, Track } from '@/libs/interfaces/spotify.interface'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/buttons'
import { BookText, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'


export const MyJournals = () => {
    const { t } = useTranslation()
    const appRouter = useRouter()
    const { data: journalsData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isJournalLoading } = useGetMyJournals(20)
    const journals = useMemo(() => {
        if (isJournalLoading) return []
        const journalsArray = journalsData?.pages.flatMap(page => page.data) ?? []
        return journalsArray?.map(journal => new Journal(journal)) ?? []
    }, [isJournalLoading, journalsData?.pages])
    
    const { ref, inView } = useInView()
    
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage])
    
    const { subjectMap } = useJournalWithObjects(journals)
    
    const groupJournalsByMonth = useMemo((): JournalByMonth => {
        return journals.reduce<JournalByMonth>((acc, journal) => {
            const date = new Date(journal.createdAt)
            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            if (!acc[yearMonth]) acc[yearMonth] = []
            acc[yearMonth].push(journal)
            return acc
        }, {})
    }, [journals])
    
    const sortedEntries: [string, Journal[]][] = useMemo(() => Object.entries(groupJournalsByMonth).sort(
        (a, b) => b[0].localeCompare(a[0])
    ), [groupJournalsByMonth])
    
    const PlusIcon = useMemo(() => <Plus className='w-5 h-5 text-tunelog-secondary'/>, [])
    
    return (
        <div className='flex flex-col w-full gap-y-10'>
            <Button.Box text={t('journals.new_journal')} leftIcon={PlusIcon} className='text-14-regular w-fit h-10' onClick={() => appRouter.push('/journals/create')}/>
            {
                isJournalLoading && isEmpty(sortedEntries) && (
                    <div className='flex gap-x-3'>
                        {
                            Array.from({ length: 5 }).map((_, index) => (
                                <Cards.BigSkeleton key={`AllJournals-Skeleton-${index}`}/>
                            ))
                        }
                    </div>
                )
            }
            {
                !isJournalLoading && isEmpty(sortedEntries) && (
                    <div className='flex flex-col items-center justify-center w-full py-20 text-center gap-y-4'>
                        <BookText className='w-10 h-10 text-white'/>
                        <div className='flex flex-col gap-y-1'>
                            <p className='text-16-bold text-white'>{t('journals.no_journal_yet')}</p>
                            <p className='text-14-regular text-tunelog-secondary'>{t('journals.leave_journal')}</p>
                        </div>
                    </div>
                )
            }
            {
                !isJournalLoading && !isEmpty(sortedEntries) && (
                    <div className='flex flex-col gap-y-5'>
                        {
                            sortedEntries.map(([yearMonth, monthJournals]) => (
                                <div key={yearMonth} className='flex flex-col gap-y-5'>
                                    <p className='text-white'>{yearMonth}</p>
                                    <div className='flex gap-x-3 overflow-x-auto hide-sidebar'>
                                        {
                                            monthJournals.map((journal, index) => {
                                                const subject = journal.subjects[0]
                                                if (!subject || !subject.spotifyId || !subjectMap[subject.spotifyId])
                                                    return (
                                                        <Cards.BigSkeleton key={`${yearMonth}-${index}`}/>
                                                    )
                                                const subjectData = subjectMap[subject.spotifyId]
                                                const imgUrl = subject.type === 'track' ? (subjectData as Track)?.album?.images[0].url : (subjectData as Artist | Album).images[0].url
                                                return (
                                                    <div onClick={() => appRouter.push(`/journals/${journal._id}`)} key={`${yearMonth}-${index}`}>
                                                        <Cards.Big
                                                            imgUrl={imgUrl ?? '/favicon.ico'}
                                                            title={journal.title}
                                                            subtitle={journal.author ?? 'Anonymous'}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
            <div ref={ref} className='h-[1px] '/>
            {
                isFetchingNextPage && hasNextPage && (
                    <div className='flex gap-x-3'>
                        {
                            Array.from({ length: 5 }).map((_, index) => (
                                <Cards.BigSkeleton key={`AllJournals-Skeleton-${index}`}/>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}