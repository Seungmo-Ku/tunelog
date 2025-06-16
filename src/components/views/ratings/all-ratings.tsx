'use client'

import { useGetAllRatings } from '@/hooks/use-rating'
import { useRatingWithObjects } from '@/hooks/use-rating-with-objects'
import { Cards } from '@/components/cards'
import { SearchType } from '@/libs/constants/spotify.constant'
import { FilterButtons } from '@/components/views/ratings/filter-buttons'
import { useMemo, useState } from 'react'
import { SortingButtons } from '@/components/views/ratings/sorting-buttons'
import { Button } from '@/components/buttons'
import { EllipsisVertical, Plus } from 'lucide-react'
import { Dialogs } from '@/components/dialogs'


export const AllRatings = () => {
    const [filterIndex, setFilterIndex] = useState(0)
    const [sortingIndex, setSortingIndex] = useState(0)
    const [newRatingOpen, setNewRatingOpen] = useState(false)
    
    const { data: ratings, isLoading: isRatingLoading } = useGetAllRatings(1000) // TODO. Pagination or infinite scroll
    
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
    
    const { isLoading, albumsById, tracksById, artistsById } = useRatingWithObjects(filteredRatings, isRatingLoading)
    
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
                    isLoading ?
                    Array.from({ length: 5 }).map((_, index) => (
                        <Cards.LongSkeleton key={`AllRatings-Skeleton-${index}`}/>
                    )) :
                    filteredRatings?.map((rating, index) => {
                        let imgUrl: string = '', title: string = ''
                        switch (rating.type) {
                            case SearchType.album:
                                const album = albumsById[rating.spotifyId]
                                imgUrl = album.images[0].url
                                title = album.name
                                break
                            case SearchType.artist:
                                const artist = artistsById[rating.spotifyId]
                                imgUrl = artist.images[0].url
                                title = artist.name
                                break
                            case SearchType.track:
                                const track = tracksById[rating.spotifyId]
                                imgUrl = track.album.images[0].url
                                title = track.name
                        }
                        return (
                            <div key={`AllRatings-${index}`} className='mb-[10px] !w-full group transition active:scale-95'>
                                <Cards.Long
                                    imgUrl={imgUrl ?? ''}
                                    title={`${title}`}
                                    type={rating.type}
                                    duration={`${rating.score}/5`}
                                    rightIcon={ratingsComponent}
                                    containerClassName='!w-full rounded-none rounded-t-[15px]'
                                />
                                <div className='w-full bg-white/50 h-[1px]'/>
                                <div className='w-full flex flex-col bg-[#33373B] overflow-hidden rounded-b-[15px] p-[10px] text-white text-13-regular gap-y-1'>
                                    <span className='whitespace-pre-line break-keep'>{rating.comment}</span>
                                    <span className='text-12-regular'>{`${new Date(rating.createdAt).toLocaleDateString()} ${rating.author ?? ''}`}</span>
                                    {rating.createdAt !== rating.updatedAt && <span className='text-12-regular'>Last Edited: {new Date(rating.updatedAt).toLocaleDateString()}</span>}
                                </div>
                            </div>
                        )
                    })
                    
                }
            </div>
            <Dialogs.NewRating open={newRatingOpen} onCloseAction={() => setNewRatingOpen(false)}/>
        </div>
    
    )
}