'use client'

import { useGetAllRatings } from '@/hooks/use-rating'
import { useRatingWithObjects } from '@/hooks/use-rating-with-objects'
import { Cards } from '@/components/cards'
import { SearchType } from '@/libs/constants/spotify.constant'
import { FilterButtons } from '@/components/views/ratings/filter-buttons'
import { useMemo, useState } from 'react'
import { SortingButtons } from '@/components/views/ratings/sorting-buttons'
import { Button } from '@/components/buttons'
import { Plus } from 'lucide-react'


export const AllRatings = () => {
    const [filterIndex, setFilterIndex] = useState(0)
    const [sortingIndex, setSortingIndex] = useState(0)
    
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
    
    const PlusIcon = useMemo(() => <Plus className='w-5 h-5 text-tunelog-secondary' />, [])
    
    //TODO. Rating 용 검색창 따로 만들기, grid 는 journal 탭에서 사용, rating 에서는 가로로 긴 컴포넌트에 누르면 disclosure 같은 거 사용
    return (
        <div className='flex flex-col gap-y-10'>
            <div className='w-full flex gap-x-5'>
                <FilterButtons filterIndex={filterIndex} setFilterIndexAction={setFilterIndex}/>
                <div className='w-[1px] h-full bg-white'/>
                <SortingButtons sortingIndex={sortingIndex} setSortingIndexAction={setSortingIndex}/>
                <div className='w-[1px] h-full bg-white'/>
                <Button.Box text='New Rating' leftIcon={PlusIcon} className='text-14-regular' />
            </div>
            <div className='grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-5 gap-y-8 w-full'>
                {
                    isLoading ?
                    Array.from({ length: 5 }).map((_, index) => (
                        <Cards.BigSkeleton key={`NewestRatings-Skeleton-${index}`}/>
                    )) :
                    filteredRatings?.map((rating, index) => {
                        switch (rating.type) {
                            case SearchType.album:
                                const album = albumsById[rating.spotifyId]
                                return <Cards.Big imgUrl={album.images[0].url} title={`${album.name}`} subtitle={`${rating.score}/5`} key={`AllRatings-${index}`}/>
                            case SearchType.artist:
                                const artist = artistsById[rating.spotifyId]
                                return <Cards.Big imgUrl={artist.images[0].url} title={`${artist.name}`} subtitle={`${rating.score}/5`} key={`AllRatings-${index}`}/>
                            case SearchType.track:
                                const track = tracksById[rating.spotifyId]
                                return <Cards.Big imgUrl={track.album.images[0].url} title={`${track.name}`} subtitle={`${rating.score}/5`} key={`AllRatings-${index}`}/>
                        }
                    })
                    
                }
            </div>
        </div>
    
    )
}