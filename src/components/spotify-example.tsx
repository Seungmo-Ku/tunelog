'use client'

import { useGetAlbumsQuery, useSearchAlbumsQuery } from '@/hooks/use-spotify'
import { Cards } from '@/components/cards'
import { EllipsisVertical, Heart } from 'lucide-react'
import { useGetAllRatings } from '@/hooks/use-rating'
import { useMemo } from 'react'


export const SpotifyExample = () => {
    
    const { data, isLoading } = useSearchAlbumsQuery('Djo')
    const { data: ratings } = useGetAllRatings()
    
    const ids = useMemo(() => {
        if(!ratings) return []
        return ratings.map(rating => rating.spotifyId)
    }, [ratings])
    
    const { data: albums } = useGetAlbumsQuery(ids)
    
    if (!data || isLoading) return <div/>
    console.log('ratings', ratings)
    console.log('albums', albums)
    return (
        <div className='flex flex-col gap-y-[40px] overflow-y-scroll'>
            <div className='flex gap-x-[30px] shrink-0'>
                {
                    data.items?.map((album, index) => {
                        return (
                            <Cards.Default imgUrl={album.images[0].url} title={album.name} subtitle={album.artists.map(artist => artist.name).join(', ')} key={`Default-${index}`}/>
                        )
                    })
                    
                }
            </div>
            <div className='flex gap-x-[30px]'>
                {
                    data.items?.map((album, index) => {
                        return (
                            <Cards.Big imgUrl={album.images[0].url} title={album.name} subtitle={album.artists.map(artist => artist.name).join(', ')} key={`Big-${index}`}/>
                        )
                    })
                    
                }
            </div>
            <div className='flex flex-col gap-y-[30px]'>
                {
                    data.items?.map((album, index) => {
                        return (
                            <div className='flex flex-row gap-x-[30px] w-full items-center' key={`Chart-${index}`}>
                                <Cards.Chart imgUrl={album.images[0].url} title={album.name} subtitle={album.artists.map(artist => artist.name).join(', ')} icon={<Heart className='text-tunelog-secondary w-4 h-4'/>}/>
                                <Cards.Long
                                    imgUrl={album.images[0].url}
                                    title={album.name}
                                    type={album.artists.map(artist => artist.name).join(', ')}
                                    duration={'album'}
                                    leftIcon={<Heart className='text-white w-5 h-5'/>}
                                    rightIcon={<EllipsisVertical className='text-tunelog-secondary w-5 h-5'/>}
                                    containerClassName={'h-[60px]'}
                                />
                            </div>
                        
                        )
                    })
                    
                }
            </div>
        </div>
    )
}