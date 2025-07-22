'use client'

import { Cards } from '@/components/cards'
import { useCallback, useMemo } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useGetAllPublicJournals } from '@/hooks/use-journal'
import { Album, Artist, Track } from '@/libs/interfaces/spotify.interface'
import { SearchType } from '@/libs/constants/spotify.constant'
import { Journal, Tags } from '@/libs/interfaces/journal.interface'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/navigation'
import { useJournalWithObjects } from '@/hooks/use-journal-with-objects'


export const TopJournal = () => {
    
    const appRouter = useRouter()
    const { data: journalsData, isLoading: isJournalLoading } = useGetAllPublicJournals(4)
    const journals = useMemo(() => {
        if (isJournalLoading) return []
        const journalsArray = journalsData?.pages.flatMap(page => page.data) ?? []
        return journalsArray?.map(journal => new Journal(journal)) ?? []
    }, [isJournalLoading, journalsData?.pages])
    
    const { subjectMap, isLoading: isSubjectLoading } = useJournalWithObjects(journals)
    
    const tagsToString = useCallback((tags: Tags | undefined) => {
        if (isEmpty(tags)) return ''
        const tagValues: string[] = Object.values(tags).filter(tag => !isEmpty(tag)).map(tag => `#${tag}`)
        return tagValues.join(' ')
    }, [])
    
    const ArrowUpRightIcon = useMemo(() => {
        return <ArrowUpRight className='text-white'/>
    }, [])
    
    const isLoading = useMemo(() => isJournalLoading || isSubjectLoading,
        [isJournalLoading, isSubjectLoading])
    
    return (
        <div className='w-full max-h-full flex flex-col gap-y-3 overflow-y-scroll'>
            {
                isLoading ?
                Array.from({ length: 4 }).map((_, index) => (
                    <Cards.ChartSkeleton key={`TopJournal-Skeleton-${index}`}/>
                )) :
                journals?.map((journal, index) => {
                    const subject = journal.subjects[0]
                    const subjectData = subjectMap[subject.spotifyId]
                    const imgUrl = subject.type === SearchType.track ? (subjectData as Track)?.album?.images[0].url : (subjectData as Artist | Album).images[0].url
                    return (
                        <div onClick={() => appRouter.push(`/journals/${journal._id}`)} className='cursor-pointer' key={`TopJournal-${index}`}>
                            <Cards.Chart
                                key={index}
                                imgUrl={imgUrl ?? '/favicon.ico'}
                                title={journal.title}
                                subtitle={new Date(journal.createdAt).toLocaleDateString()}
                                additionalInfo={tagsToString(journal.tags)}
                                icon={ArrowUpRightIcon}
                                containerClassName='w-full'
                            />
                        </div>
                    )
                })
            }
            {!isJournalLoading &&
                <div className='flex flex-col gap-y-[5px] w-full p-[17px] pr-[21px] shrink-0 justify-center rounded-[20px] bg-white/5 hover:bg-white/10 transition cursor-pointer items-center active:scale-95'
                     onClick={() => appRouter.push('/community#initialFilter=2')}>
                    <p className='text-white text-14-bold text-center'>View more Journal</p>
                </div>}
        </div>
    )
}