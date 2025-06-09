'use client'

import { useSearchAlbumQuery } from '@/hooks/use-spotify'


export const SpotifyExample = () => {
    
    const { data, isLoading } = useSearchAlbumQuery('Tyler, The Creator')
    
    if (!data || isLoading) return <div/>
    console.log('SpotifyExample data', data)
    return (
        <div>
            <div className='grid grid-cols-3'>
                {
                    data.items?.map((album, index) => {
                        return (
                            <div key={`album-${index}`}>
                                <p className='line-clamp-1'>{album.name}</p>
                                <img src={album.images[0].url} alt={album.name} className='w-32 h-32 object-cover' />
                            </div>
                        )
                    })
                }
            </div>
        
        </div>
    )
}