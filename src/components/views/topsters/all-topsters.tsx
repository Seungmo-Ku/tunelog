'use client'

import { Button } from '@/components/buttons'
import { isEmpty } from 'lodash'
import { LayoutGrid, Plus } from 'lucide-react'
import { Cards } from '@/components/cards'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useGetMyTopsters, useGetUserTopsters } from '@/hooks/use-topster'
import { Topster } from '@/libs/interfaces/topster.interface'
import { useInView } from 'react-intersection-observer'


interface AllTopstersProps {
    showMyTopster: boolean
    uid?: string | null | undefined
}

export const AllTopsters = ({
    showMyTopster = true,
    uid
}: AllTopstersProps) => {
    const { t } = useTranslation()
    const appRouter = useRouter()
    const { data: myTopstersData, fetchNextPage: myFetchNextPage, hasNextPage: myHasNextPage, isFetchingNextPage: isMyFetchingNextPage, isLoading: isMyTopsterLoading } = useGetMyTopsters(20, showMyTopster)
    const { data: userTopstersData, fetchNextPage: userFetchNextPage, hasNextPage: userHasNextPage, isFetchingNextPage: isUserFetchingNextPage, isLoading: isUserTopsterLoading } = useGetUserTopsters(uid ?? '', 20, !showMyTopster)
    
    const topsters = useMemo(() => {
        if (showMyTopster) {
            if (isMyTopsterLoading) return []
            const topstersArray = myTopstersData?.pages.flatMap(page => page.data) ?? []
            return topstersArray?.map(topster => new Topster(topster)) ?? []
        } else {
            if (isUserTopsterLoading) return []
            const topstersArray = userTopstersData?.pages.flatMap(page => page.data) ?? []
            return topstersArray?.map(topster => new Topster(topster)) ?? []
        }
    }, [isMyTopsterLoading, isUserTopsterLoading, myTopstersData?.pages, showMyTopster, userTopstersData?.pages])
    const { ref, inView } = useInView()
    
    useEffect(() => {
        if (inView) {
            if (showMyTopster && !isMyFetchingNextPage && myHasNextPage)
                myFetchNextPage()
            else if (!showMyTopster && !isUserFetchingNextPage && userHasNextPage)
                userFetchNextPage()
        }
    }, [inView, isMyFetchingNextPage, isUserFetchingNextPage, myFetchNextPage, myHasNextPage, showMyTopster, userFetchNextPage, userHasNextPage])
    
    const PlusIcon = useMemo(() => <Plus className='w-5 h-5 text-tunelog-secondary'/>, [])
    
    const isLoading = useMemo(() => {
        return showMyTopster ? isMyTopsterLoading : isUserTopsterLoading
    }, [isMyTopsterLoading, isUserTopsterLoading, showMyTopster])
    
    return (
        <div className='text-white w-full h-full flex flex-col gap-y-10'>
            {showMyTopster && <Button.Box text={t('topsters.new_topster')} leftIcon={PlusIcon} className='text-14-regular w-fit h-10' onClick={() => appRouter.push('/topsters/create')}/>}
            <div className='w-full flex flex-col gap-y-2.5'>
                {isEmpty(topsters) && !isLoading && (
                    <div className='flex flex-col items-center justify-center w-full py-20 text-center gap-y-4'>
                        <LayoutGrid className='w-10 h-10 text-white'/>
                        <div className='flex flex-col gap-y-1'>
                            <p className='text-16-bold'>{t('topsters.no_topster_yet')}</p>
                            {showMyTopster && <p className='text-14-regular text-tunelog-secondary'>{t('topsters.leave_topster')}</p>}
                        </div>
                    </div>
                )}
                {topsters.map(topster => (
                    <Cards.Topster
                        key={topster._id}
                        topster={topster}
                        showTransitionOnClick
                        onClick={() => appRouter.push(`/topsters/${topster._id}`)}
                    />
                ))}
                {(isMyFetchingNextPage || isUserFetchingNextPage) && (
                    <>
                        <Cards.TopsterSkeleton/>
                        <Cards.TopsterSkeleton/>
                        <Cards.TopsterSkeleton/>
                    </>
                )}
            </div>
            
            <div ref={ref}/>
        </div>
    )
}