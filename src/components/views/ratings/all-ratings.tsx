'use client'

import { useGetAllRatings } from '@/hooks/use-rating'
import { useRatingWithObjects } from '@/hooks/use-rating-with-objects'
import { Cards } from '@/components/cards'
import { SearchType } from '@/libs/constants/spotify.constant'
import { FilterButtons } from '@/components/views/ratings/filter-buttons'
import { useEffect, useMemo, useState } from 'react'
import { SortingButtons } from '@/components/views/ratings/sorting-buttons'
import { Button } from '@/components/buttons'
import { EllipsisVertical, Plus } from 'lucide-react'
import { Dialogs } from '@/components/dialogs'
import { Rating } from '@/libs/interfaces/rating.interface'
import { useInView } from 'react-intersection-observer'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/navigation'
import { useAtom } from 'jotai'
import { MakeRatingAtom } from '@/components/buttons/button-make-rating'


export const AllRatings = () => {
    const appRouter = useRouter()
    const [filterIndex, setFilterIndex] = useState(0)
    const [sortingIndex, setSortingIndex] = useState(0)
    const [newRatingOpen, setNewRatingOpen] = useState(false)
    const [makeRating, setMakeRating] = useAtom(MakeRatingAtom)
    
    const { data: ratingsData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isRatingLoading } = useGetAllRatings(20)
    
    const ratings = useMemo(() => {
        if (isRatingLoading) return []
        const ratingsArray = ratingsData?.pages.flatMap(page => page.data) ?? []
        return ratingsArray?.map(rating => new Rating(rating)) ?? []
    }, [isRatingLoading, ratingsData?.pages])
    
    const { ref, inView } = useInView()
    
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage])
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!makeRating) {
                history.replaceState(null, '', ' ')
                return
            }
            
            const hash = window.location.hash.substring(1)
            if (hash) {
                const params = new URLSearchParams(hash)
                const objectId = params.get('initialSelectedObjectId') ?? undefined
                const objectType = params.get('initialSelectedType') as SearchType | null
                
                if (objectId && objectType && makeRating) {
                    setMakeRating(false)
                    setTimeout(() => {
                        setNewRatingOpen(true)
                    }, 500)
                }
            }
        }
    }, [makeRating, setMakeRating])
    
    const filteredRatings = useMemo(() => {
        if (!ratings) return []
        const base =
            filterIndex === 0
            ? ratings
            : ratings.filter(rating => {
                switch (filterIndex) {
                    case 1:
                        return rating.type === SearchType.album
                    case 2:
                        return rating.type === SearchType.artist
                    case 3:
                        return rating.type === SearchType.track
                    default:
                        return true
                }
            })
        
        return sortingIndex === 0 ? base : [...base].reverse()
    }, [filterIndex, ratings, sortingIndex])
    
    const { albumsById, tracksById, artistsById } = useRatingWithObjects(filteredRatings)
    
    const PlusIcon = useMemo(() => <Plus className='w-5 h-5 text-tunelog-secondary'/>, [])
    
    const ratingsComponent = useMemo(() => <EllipsisVertical className='text-tunelog-secondary w-5 h-5'/>, [])
    
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
                    isRatingLoading && isEmpty(filteredRatings) &&
                    Array.from({ length: 5 }).map((_, index) => (
                        <Cards.LongSkeleton key={`AllRatings-Skeleton-${index}`}/>
                    ))
                }
                {
                    !isRatingLoading && !isEmpty(filteredRatings) &&
                    filteredRatings?.map((rating, index) => {
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
                            return <Cards.LongSkeleton key={`AllRatings-${index}`}/>
                        }
                        return (
                            <button
                                key={`AllRatings-${index}`}
                                className='mb-[10px] !w-full group transition active:scale-95'
                                onClick={() => {
                                    appRouter.push(`/detail/${rating.type}/${rating.spotifyId}`)
                                }}
                            >
                                <Cards.Long
                                    imgUrl={imgUrl}
                                    title={`${title}`}
                                    type={rating.type}
                                    duration={`${rating.score}/5`}
                                    rightIcon={ratingsComponent}
                                    containerClassName='!w-full rounded-none rounded-t-[15px]'
                                />
                                <div className='w-full bg-white/50 h-[1px]'/>
                                <div className='w-full flex flex-col bg-[#33373B] overflow-hidden rounded-b-[15px] p-[10px] text-white text-13-regular gap-y-1'>
                                    <span className='whitespace-pre-line break-keep text-left'>{rating.comment}</span>
                                    <span className='text-12-regular text-left'>{`${new Date(rating.createdAt).toLocaleDateString()} ${rating.author ?? 'Anynomous'}`}</span>
                                    {rating.createdAt !== rating.updatedAt && <span className='text-12-regular text-left'>Last Edited: {new Date(rating.updatedAt).toLocaleDateString()}</span>}
                                </div>
                            </button>
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