'use client'

import { useGetAllTopsters } from '@/hooks/use-topster'
import { useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import { Topster } from '@/libs/interfaces/topster.interface'


const TopstersPage = () => {
    const { data: topstersData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isTopsterLoading } = useGetAllTopsters(20)
    const topsters = useMemo(() => {
        if (isTopsterLoading) return []
        const topstersArray = topstersData?.pages.flatMap(page => page.data) ?? []
        return topstersArray?.map(topster => new Topster(topster)) ?? []
    }, [isTopsterLoading, topstersData?.pages])
    console.log('topsters', topsters)
    const { ref, inView } = useInView()
    
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage])
    
    return (
        <div className='text-white w-full h-full flex flex-col'>
            <div ref={ref}/>
        </div>
    )
}

export default TopstersPage