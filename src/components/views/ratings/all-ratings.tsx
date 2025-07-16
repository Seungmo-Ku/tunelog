'use client'

import { useGetAllRatings } from '@/hooks/use-rating'
import { useRatingWithObjects } from '@/hooks/use-rating-with-objects'
import { Cards } from '@/components/cards'
import { SearchType } from '@/libs/constants/spotify.constant'
import { FilterButtons } from '@/components/views/ratings/filter-buttons'
import { useEffect, useMemo, useState } from 'react'
import { SortingButtons } from '@/components/views/ratings/sorting-buttons'
import { Button } from '@/components/buttons'
import { Plus } from 'lucide-react'
import { Dialogs } from '@/components/dialogs'
import { Rating } from '@/libs/interfaces/rating.interface'
import { useInView } from 'react-intersection-observer'
import { isEmpty, noop } from 'lodash'
import { useRouter } from 'next/navigation'
import { useAtom } from 'jotai'
import { MakeRatingAtom } from '@/components/buttons/button-make-rating'
import { useRatingHash } from '@/libs/utils/rating'


export const AllRatings = () => {
    const appRouter = useRouter()
    const [filterIndex, setFilterIndex] = useState(0)
    const [sortingIndex, setSortingIndex] = useState(0)
    const [newRatingOpen, setNewRatingOpen] = useState(false)
    const [makeRating, setMakeRating] = useAtom(MakeRatingAtom)
    
    const selectedFilter = useMemo(() => {
        switch (filterIndex) {
            case 0:
                return 'all'
            case 1:
                return SearchType.album
            case 2:
                return SearchType.artist
            case 3:
            default:
                return SearchType.track
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
    
    const { data: ratingsData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isRatingLoading } = useGetAllRatings(20, selectedFilter, selectedSorting)
    
    const ratings = useMemo(() => {
        if (isRatingLoading) return []
        const ratingsArray = ratingsData?.pages.flatMap(page => page.data) ?? []
        return ratingsArray?.map(rating => new Rating(rating)) ?? []
    }, [isRatingLoading, ratingsData?.pages])
    
    const { ref, inView } = useInView()
    
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage().then(noop)
        }
    }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage])
    
    const { objectId, objectType } = useRatingHash()
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!makeRating) {
                history.replaceState(null, '', window.location.pathname)
                return
            }
            if (objectId && objectType && makeRating) {
                setMakeRating(false)
                setTimeout(() => {
                    setNewRatingOpen(true)
                }, 500)
            }
        }
    }, [makeRating, objectId, objectType, setMakeRating])
    
    const { albumsById, tracksById, artistsById } = useRatingWithObjects(ratings)
    
    const PlusIcon = useMemo(() => <Plus className='w-5 h-5 text-tunelog-secondary'/>, [])
    
    //TODO. Rating 용 검색창 따로 만들기, grid 는 journal 탭에서 사용, rating 에서는 가로로 긴 컴포넌트에 누르면 disclosure 같은 거 사용
    return (
        <div className='flex flex-col gap-y-10 relative w-full overflow-x-hidden'>
            <div className='w-full flex md:flex-row flex-col  gap-x-5 gap-y-4'>
                <FilterButtons filterIndex={filterIndex} setFilterIndexAction={setFilterIndex}/>
                <div className='w-[1px] h-full bg-white md:flex hidden'/>
                <SortingButtons sortingIndex={sortingIndex} setSortingIndexAction={setSortingIndex}/>
                <div className='w-[1px] h-full bg-white md:flex hidden'/>
                <Button.Box text='New Rating' leftIcon={PlusIcon} className='text-14-regular w-fit h-10' onClick={() => setNewRatingOpen(true)}/>
            </div>
            <div className='flex flex-col w-full'>
                {
                    isRatingLoading && isEmpty(ratings) &&
                    Array.from({ length: 5 }).map((_, index) => (
                        <Cards.LongSkeleton key={`AllRatings-Skeleton-${index}`}/>
                    ))
                }
                {
                    !isRatingLoading && !isEmpty(ratings) &&
                    ratings?.map((rating, index) => {
                        let imgUrl: string = '', title: string = ''
                        if (!rating.spotifyId || !rating.type) {
                            return <Cards.LongSkeleton key={`AllRatings-Skeleton-in-${index}`}/>
                        }
                        switch (rating.type) {
                            case SearchType.album:
                                const album = albumsById[rating.spotifyId] ?? null
                                imgUrl = album?.images[0].url ?? ''
                                title = album?.name ?? ''
                                break
                            case SearchType.artist:
                                const artist = artistsById[rating.spotifyId] ?? null
                                imgUrl = artist?.images[0].url ?? ''
                                title = artist?.name ?? ''
                                break
                            case SearchType.track:
                                const track = tracksById[rating.spotifyId] ?? null
                                imgUrl = track?.album?.images[0].url ?? ''
                                title = track?.name ?? ''
                        }
                        if (isEmpty(imgUrl) || isEmpty(title)) {
                            return <Cards.RatingWithContentSkeleton key={`AllRatings-${index}`}/>
                        }
                        return (
                            <Cards.RatingWithContent
                                key={`AllRatings-${index}`}
                                rating={rating}
                                imgUrl={imgUrl}
                                title={title}
                                onClickAction={() => {
                                    appRouter.push(`/detail/${rating.type}/${rating.spotifyId}`)
                                }}
                            />
                        )
                    })
                }
                <div ref={ref}/>
                {
                    isFetchingNextPage && hasNextPage &&
                    <Cards.LongSkeleton/>
                }
            </div>
            <Dialogs.NewRating
                open={newRatingOpen}
                onCloseAction={() => setNewRatingOpen(false)}
            />
        </div>
    
    )
}