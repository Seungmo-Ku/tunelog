'use client'

import { useGetAllTopsters } from '@/hooks/use-topster'
import { useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import { Topster } from '@/libs/interfaces/topster.interface'
import { Cards } from '@/components/cards'
import { Button } from '@/components/buttons'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'


const TopstersPage = () => {
    
    const appRouter = useRouter()
    const { data: topstersData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isTopsterLoading } = useGetAllTopsters(20)
    const topsters = useMemo(() => {
        if (isTopsterLoading) return []
        const topstersArray = topstersData?.pages.flatMap(page => page.data) ?? []
        return topstersArray?.map(topster => new Topster(topster)) ?? []
    }, [isTopsterLoading, topstersData?.pages])
    const { ref, inView } = useInView()
    
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage])
    
    const PlusIcon = useMemo(() => <Plus className='w-5 h-5 text-tunelog-secondary'/>, [])
    
    return (
        <div className='text-white w-full h-full flex flex-col gap-y-10'>
            <Button.Box text='New Topster' leftIcon={PlusIcon} className='text-14-regular w-fit h-10' onClick={() => appRouter.push('/topsters/create')}/>
            <div className='w-full flex flex-col gap-y-2.5'>
                {topsters.map(topster => (
                    <Cards.Topster
                        key={topster._id}
                        topster={topster}
                        showTransitionOnClick
                        onClick={() => appRouter.push(`/topsters/${topster._id}`)}
                    />
                ))}
                {isTopsterLoading && (
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

export default TopstersPage