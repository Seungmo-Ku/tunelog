'use client'

import { useGetAllRatings } from '@/hooks/use-rating'
import { useMemo } from 'react'
import { useGetAlbumsQuery } from '@/hooks/use-spotify'
import { Cards } from '@/components/cards'
import { Rating } from '@/libs/interfaces/rating.interface'


export const NewestRatings = () => {
    
    const { data: ratings } = useGetAllRatings()
    
    const idsOfRatings = useMemo(() => {
        if(!ratings) return []
        return ratings.map(rating => rating.spotifyId)
    }, [ratings])
    
    const { data: albums, isLoading } = useGetAlbumsQuery(idsOfRatings) // ratings 에서 type 에 따라 분리해서 따로 쿼리
    // const { data: album } = useGetAlbumQuery(idsOfRatings[0]) // 첫번째 앨범을 가져오는 쿼리, 필요시 사용
    
    const ratingsWithAlbums = useMemo(() => {
        if (!ratings) return {}
        
        return ratings.reduce((acc, rating) => {
            acc[rating.spotifyId] = rating
            return acc
        }, {} as Record<string, Rating>)
    }, [ratings])
    
    return (
        <div className='flex flex-row gap-x-[30px]'>
            {
                isLoading ? <div>Loading...</div> :
                albums?.map((album, index) => {
                    const rating = ratingsWithAlbums[album.id]
                    return (
                        <Cards.Default imgUrl={album.images[0].url} title={`${album.name} - ${rating.type}`} periphery={`${rating.score}/5`} subtitle={rating.comment.split('\\n')[0]} key={`NewestRatings-${index}`}/>
                    )
                })
            }
        </div>
    )
}