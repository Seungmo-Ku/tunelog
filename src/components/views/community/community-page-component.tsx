'use client'

import { useAccount } from "@/libs/utils/account"
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useGetCommunityItems } from '@/hooks/use-community'
import { CommunityItem } from '@/libs/interfaces/community.interface'
import { IRating, Rating } from '@/libs/interfaces/rating.interface'
import { IJournal, Journal } from '@/libs/interfaces/journal.interface'
import { ITopster, Topster } from '@/libs/interfaces/topster.interface'
import { useInView } from 'react-intersection-observer'
import { AccountStatus } from '@/libs/constants/account.constant'
import { clsx } from 'clsx'
import { FilterButtons } from '@/components/views/ratings/filter-buttons'
import { SortingButtons } from '@/components/views/ratings/sorting-buttons'
import { FollowingButtons } from '@/components/views/community/following-buttons'
import { isEmpty } from 'lodash'
import { Star } from 'lucide-react'
import { Cards } from "@/components/cards"


interface CommunityPageComponentProps {
    viewOnlyFollowing?: boolean
}

export const CommunityPageComponent = ({
    viewOnlyFollowing = false
}: CommunityPageComponentProps) => {
    const appRouter = useRouter()
    const { status } = useAccount()
    const [filterIndex, setFilterIndex] = useState(0)
    const [sortingIndex, setSortingIndex] = useState(0)
    const [followingIndex, setFollowingIndex] = useState(0)
    
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
    
    const selectedFollowing = useMemo(() => {
        if (viewOnlyFollowing) return 'following'
        switch (followingIndex) {
            case 0:
                return 'all'
            case 1:
            default:
                return 'following'
        }
    }, [followingIndex, viewOnlyFollowing])
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash.substring(1)
            if (hash) {
                const params = new URLSearchParams(hash)
                const filter = parseInt(params.get('initialFilter') ?? '0', 10) || 0
                const followingFilter = parseInt(params.get('initialFollowing') ?? '0', 10) || 0
                if (!isNaN(filter) && filter >= 0 && filter <= 3) {
                    setFilterIndex(filter)
                }
                if (!isNaN(followingFilter) && followingFilter >= 0 && followingFilter <= 1) {
                    setFollowingIndex(followingFilter)
                }
                history.replaceState(null, '', window.location.pathname)
            }
        }
    }, [])
    
    const { data: communityItemsData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetCommunityItems(10, selectedFilter, selectedSorting, selectedFollowing)
    
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
        if (inView && hasNextPage && !isFetchingNextPage && !viewOnlyFollowing) {
            fetchNextPage()
        }
    }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage, viewOnlyFollowing])
    
    const showFollowingButton = useMemo(() => {
        return status !== AccountStatus.guest && !viewOnlyFollowing
    }, [status, viewOnlyFollowing])
    
    return (
        <div className={clsx('w-full h-full p-4 overflow-y-auto hide-sidebar flex flex-col', viewOnlyFollowing ? 'p-0' : 'p-4')}>
            {
                !viewOnlyFollowing && (
                    <div className='w-full flex md:flex-row flex-col  gap-x-5 gap-y-4 mb-4'>
                        <FilterButtons filterIndex={filterIndex} setFilterIndexAction={setFilterIndex} type='community'/>
                        <div className='w-[1px] h-full bg-white md:flex hidden'/>
                        <SortingButtons sortingIndex={sortingIndex} setSortingIndexAction={setSortingIndex}/>
                        {showFollowingButton && <div className='w-[1px] h-full bg-white md:flex hidden'/>}
                        {showFollowingButton && <FollowingButtons followingIndex={followingIndex} setFollowingIndexAction={setFollowingIndex}/>}
                    </div>
                )
            }
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
                            <p className='text-14-regular text-tunelog-secondary'>{viewOnlyFollowing ? 'Follow someone to see what they logged!' : 'Leave a rating, journal or topster for your favorite music!'}</p>
                        </div>
                    </div>
                )
            }
            <div className={clsx(viewOnlyFollowing ? 'flex flex-row gap-x-4 overflow-x-scroll' : 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3')}>
                {
                    !isLoading && !isEmpty(communityItems) && (
                        communityItems.map(item => {
                            return (
                                <Cards.CommunityItem item={item} key={`Community-item-${item.item?._id ?? ''}`} className={viewOnlyFollowing ? '!w-[300px] shrink-0' : ''}/>
                            )
                        })
                    )
                }
                {
                    !isLoading && viewOnlyFollowing && (
                        <div className='flex flex-col w-[300px] shrink-0 justify-center rounded-[20px] bg-white/5 hover:bg-white/10 transition cursor-pointer items-center active:scale-95'
                             onClick={() => appRouter.push('/community#initialFollowing=1')}>
                            <p className='text-white text-14-bold text-center'>View more from followings</p>
                        </div>
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

