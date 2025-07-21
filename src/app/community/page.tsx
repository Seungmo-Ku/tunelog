'use client'

import { useGetCommunityItems } from '@/hooks/use-community'
import { useInView } from 'react-intersection-observer'
import { useEffect, useMemo, useState } from 'react'
import { IRating, Rating } from '@/libs/interfaces/rating.interface'
import { IJournal, Journal } from '@/libs/interfaces/journal.interface'
import { ITopster, Topster } from '@/libs/interfaces/topster.interface'
import { CommunityItem } from '@/libs/interfaces/community.interface'
import { isEmpty } from 'lodash'
import { Cards } from '@/components/cards'
import { FilterButtons } from '@/components/views/ratings/filter-buttons'
import { SortingButtons } from '@/components/views/ratings/sorting-buttons'
import { Star } from 'lucide-react'


const CommunityPage = () => {
    const [filterIndex, setFilterIndex] = useState(0)
    const [sortingIndex, setSortingIndex] = useState(0)
    
    const selectedFilter = useMemo(() => {
        switch (filterIndex) {
            case 0:
                return 'all'
            case 1:
                return 'rating'
            case 2:
                return 'journal'
            case 3:
            default:
                return 'topster'
        }
    }, [filterIndex])
    
    const selectedSorting = useMemo(() => {
        switch (sortingIndex) {
            case 0:
                return 'newest'
            case 1:
            default:
                return 'oldest'
        }
    }, [sortingIndex])
    
    const { data: communityItemsData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetCommunityItems(20, selectedFilter, selectedSorting)
    
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
    
    const { ref, inView } = useInView()
    
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage])
    
    return (
        <div className='w-full h-full p-4 overflow-y-auto hide-sidebar flex flex-col'>
            <div className='w-full flex md:flex-row flex-col  gap-x-5 gap-y-4 mb-4'>
                <FilterButtons filterIndex={filterIndex} setFilterIndexAction={setFilterIndex} type='community'/>
                <div className='w-[1px] h-full bg-white md:flex hidden'/>
                <SortingButtons sortingIndex={sortingIndex} setSortingIndexAction={setSortingIndex}/>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {
                    isEmpty(communityItems) && (
                        isLoading ?
                        Array.from({ length: 6 }).map((_, index) => (
                            <Cards.CommunityItemSkeleton key={`CommunityItem-Skeleton-${index}`}/>
                        )) :
                        <div className='flex flex-col items-center justify-center w-full py-20 text-center gap-y-4'>
                            <Star className='w-10 h-10 text-white'/>
                            <div className='flex flex-col gap-y-1'>
                                <p className='text-16-bold text-white'>No items yet</p>
                                <p className='text-14-regular text-tunelog-secondary'>Leave a rating, journal or topster for your favorite music!</p>
                            </div>
                        </div>
                    )
                }
                {
                    !isLoading && !isEmpty(communityItems) && (
                        communityItems.map(item => {
                            return (
                                <Cards.CommunityItem item={item} key={`Community-item-${item.item?._id ?? ''}`}/>
                            )
                        })
                    )
                }
            </div>
            <div ref={ref}/>
            {
                isFetchingNextPage && hasNextPage &&
                <Cards.CommunityItemSkeleton/>
            }
        </div>
    )
}

export default CommunityPage