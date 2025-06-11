'use client'

import { useSearchAlbumQuery } from '@/hooks/use-spotify'
import { Cards } from '@/components/cards'


export const SpotifyExample = () => {
    
    const { data, isLoading } = useSearchAlbumQuery('Tyler, The Creator')
    
    if (!data || isLoading) return <div/>
    console.log('SpotifyExample data', data)
    return (
        <div>
            <div className='flex gap-x-[30px]'>
                {
                    data.items?.map((album, index) => {
                        return (
                            <Cards.Default imgUrl={album.images[0].url} title={album.name} subtitle={album.artists.map(artist => artist.name).join(', ')} key={index} />
                        )
                    })
                }
            </div>
        
        </div>
    )
}