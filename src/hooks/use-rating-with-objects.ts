'use client'

import { Rating } from '@/libs/interfaces/rating.interface'
import { SearchType } from '@/libs/constants/spotify.constant'
import { useGetAlbumsQuery, useGetArtistsQuery, useGetTracksQuery } from '@/hooks/use-spotify'
import { useMemo } from 'react'
import { Album, Artist, Track } from '@/libs/interfaces/spotify.interface'


export const useRatingWithObjects = (ratings: Rating[] | null | undefined) => {
    
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
    
    return {
        albumsById,
        artistsById,
        tracksById,
        isLoading,
        albums,
        artists,
        tracks
    }
}