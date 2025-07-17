'use client'

import { useGetAllPublicRatings } from '@/hooks/use-rating'
import { Cards } from '@/components/cards'
import { SearchType } from '@/libs/constants/spotify.constant'
import { useRatingWithObjects } from '@/hooks/use-rating-with-objects'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Rating } from '@/libs/interfaces/rating.interface'


export const NewestRatings = () => {
    const appRoute = useRouter()
    const { data: ratingsData, isLoading: isRatingLoading } = useGetAllPublicRatings(10)
    
    const ratings = useMemo(() => {
        if (isRatingLoading) return []
        const ratingsArray = ratingsData?.pages.flatMap(page => page.data) ?? []
        return ratingsArray?.map(rating => new Rating(rating)) ?? []
    }, [isRatingLoading, ratingsData?.pages])
    
    const { isLoading, albumsById, tracksById, artistsById } = useRatingWithObjects(ratings)
    
    return (
        <div className='flex flex-row gap-x-[30px] overflow-x-scroll'>
            {
                (isLoading || isRatingLoading) ?
                Array.from({ length: 4 }).map((_, index) => (
                    <Cards.DefaultSkeleton key={`NewestRatings-Skeleton-${index}`}/>
                )) :
                ratings?.map((rating, index) => {
                    let imgUrl = ''
                    let title = ''
                    switch (rating.type) {
                        case SearchType.album: {
                            const album = albumsById[rating.spotifyId]
                            if (!album) return null
                            imgUrl = album.images[0].url
                            title = `${album.name} - ${rating.type}`
                            break
                        }
                        case SearchType.artist: {
                            const artist = artistsById[rating.spotifyId]
                            if (!artist) return null
                            imgUrl = artist.images[0].url
                            title = `${artist.name} - ${rating.type}`
                            break
                        }
                        case SearchType.track: {
                            const track = tracksById[rating.spotifyId]
                            if (!track) return null
                            imgUrl = track.album?.images[0].url ?? '/favicon.ico'
                            title = `${track.name} - ${rating.type}`
                            break
                        }
                    }
                    return (
                        <div
                            key={`NewestRatings-${index}`}
                            className='cursor-pointer active:scale-95 transition'
                            onClick={() => appRoute.push(`/detail/${rating.type}/${rating.spotifyId}`)}
                        >
                            <Cards.Default
                                imgUrl={imgUrl}
                                title={title}
                                periphery={`${rating.score}/5`}
                                subtitle={rating.comment.split('\n')[0]}
                            />
                        </div>
                    )
                })
            }
            {!isLoading && (
                <div
                    className='flex flex-col gap-y-[5px] w-[153px] h-[153px] shrink-0 justify-center rounded-[25px] bg-white/5 hover:bg-white/10 transition cursor-pointer items-center active:scale-95'
                    onClick={() => appRoute.push('/ratings')}
                >
                    <p className='text-white text-14-bold text-center'>View all Ratings</p>
                </div>
            )}
        </div>
    )
}