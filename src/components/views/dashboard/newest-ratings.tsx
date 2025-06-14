'use client'

import { useGetAllRatings } from '@/hooks/use-rating'
import { useMemo } from 'react'
import { useGetAlbumsQuery, useGetArtistsQuery, useGetTracksQuery } from '@/hooks/use-spotify'
import { Cards } from '@/components/cards'
import { SearchType } from '@/libs/constants/spotify.constant'
import { Album, Artist, Track } from '@/libs/interfaces/spotify.interface'


export const NewestRatings = () => {
    
    const { data: ratings } = useGetAllRatings(10)
    
    const idsOfRatings = useMemo(() => {
        if (!ratings) return {
            album: [],
            artist: [],
            track: []
        }
        
        const albumRatings = ratings.filter(rating => rating.type === SearchType.album).map(rating => rating.spotifyId)
        const artistRatings = ratings.filter(rating => rating.type === SearchType.artist).map(rating => rating.spotifyId)
        const trackRatings = ratings.filter(rating => rating.type === SearchType.track).map(rating => rating.spotifyId)
        
        return {
            album: albumRatings,
            artist: artistRatings,
            track: trackRatings
        }
    }, [ratings])
    
    const { data: albums, isLoading: isAlbumLoading } = useGetAlbumsQuery(idsOfRatings.album)
    const { data: artists, isLoading: isArtistLoading } = useGetArtistsQuery(idsOfRatings.artist)
    const { data: tracks, isLoading: isTrackLoading } = useGetTracksQuery(idsOfRatings.track)
    
    const albumsById = useMemo(() => {
        if (!albums) return {}
        return albums.reduce((acc, album) => {
            acc[album.id] = album
            return acc
        }, {} as Record<string, Album>)
    }, [albums])
    
    const artistsById = useMemo(() => {
        if (!artists) return {}
        return artists.reduce((acc, artist) => {
            acc[artist.id] = artist
            return acc
        }, {} as Record<string, Artist>)
    }, [artists])
    
    const tracksById = useMemo(() => {
        if (!tracks) return {}
        return tracks.reduce((acc, track) => {
            acc[track.id] = track
            return acc
        }, {} as Record<string, Track>)
    }, [tracks])
    
    const isLoading = useMemo(() => isAlbumLoading || isArtistLoading || isTrackLoading, [isAlbumLoading, isArtistLoading, isTrackLoading])
    
    return (
        <div className='flex flex-row gap-x-[30px] overflow-x-scroll'>
            {
                isLoading ?
                Array.from({ length: 4 }).map((_, index) => (
                    <Cards.DefaultSkeleton key={`NewestRatings-Skeleton-${index}`}/>
                )) :
                ratings?.map((rating, index) => {
                    switch (rating.type) {
                        case SearchType.album:
                            const album = albumsById[rating.spotifyId]
                            return <Cards.Default imgUrl={album.images[0].url} title={`${album.name} - ${rating.type}`} periphery={`${rating.score}/5`} subtitle={rating.comment.split('\\n')[0]} key={`NewestRatings-${index}`}/>
                        case SearchType.artist:
                            const artist = artistsById[rating.spotifyId]
                            return <Cards.Default imgUrl={artist.images[0].url} title={`${artist.name} - ${rating.type}`} periphery={`${rating.score}/5`} subtitle={rating.comment.split('\\n')[0]} key={`NewestRatings-${index}`}/>
                        case SearchType.track:
                            const track = tracksById[rating.spotifyId]
                            return <Cards.Default imgUrl={track.album.images[0].url} title={`${track.name} - ${rating.type}`} periphery={`${rating.score}/5`} subtitle={rating.comment.split('\\n')[0]} key={`NewestRatings-${index}`}/>
                    }
                })
            }
            {!isLoading && <div className='flex flex-col gap-y-[5px] w-[153px] h-[153px] shrink-0 justify-center rounded-[25px] bg-white/5 hover:bg-white/10 transition cursor-pointer items-center active:scale-95'>
                <p className='text-white text-14-bold text-center'>View all Ratings</p>
            </div>}
        </div>
    )
}