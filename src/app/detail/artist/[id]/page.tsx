'use client'

import React, { useMemo } from 'react'
import { useGetArtistAlbumsQuery, useGetArtistQuery } from '@/hooks/use-spotify'
import { Album } from '@/libs/interfaces/spotify.interface'


const ArtistDetailWithIdPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)
    const { data: artist, isLoading: isArtistLoading } = useGetArtistQuery(id ?? '')
    const { data: albumsData, isLoading: isAlbumLoading } = useGetArtistAlbumsQuery(id ?? '')
    const albums = useMemo(() => {
        if (isAlbumLoading) return []
        return albumsData?.items.map(album => new Album(album)) || []
    }, [albumsData?.items, isAlbumLoading])
    console.log('albums', albums)
    if (isArtistLoading) {
        return <div className='text-white'>Loading...</div>
    }
    return (
        <div className='w-full h-full flex flex-col overflow-y-auto hide-sidebar gap-y-10'>
            <p className='text-white'>{artist?.name}</p>
        </div>
    )
}

export default ArtistDetailWithIdPage