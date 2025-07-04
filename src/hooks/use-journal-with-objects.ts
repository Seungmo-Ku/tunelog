'use client'

import { useGetAlbumsQuery, useGetArtistsQuery, useGetTracksQuery } from '@/hooks/use-spotify'
import { useMemo } from 'react'
import { Album, Artist, Track } from '@/libs/interfaces/spotify.interface'
import { Journal } from '@/libs/interfaces/journal.interface'


export const useJournalWithObjects = (journals: Journal[] | null | undefined) => {
    
    const idsOfJournals = useMemo(() => {
        if (!journals) return {
            album: [],
            artist: [],
            track: []
        }
        
        return journals.reduce((acc, journal) => {
            const subject = journal.subjects?.[0]
            if (!subject) return acc
            
            acc[subject.type].push(subject.spotifyId)
            return acc
        }, {
            album: [],
            artist: [],
            track: []
        } as Record<'album' | 'artist' | 'track', string[]>)
    }, [journals])
    
    const { data: albums, isLoading: isAlbumLoading } = useGetAlbumsQuery(idsOfJournals.album)
    const { data: artists, isLoading: isArtistLoading } = useGetArtistsQuery(idsOfJournals.artist)
    const { data: tracks, isLoading: isTrackLoading } = useGetTracksQuery(idsOfJournals.track)
    
    const subjectMap = useMemo(() => {
        const map: Record<string, Album | Artist | Track> = {}
        
        albums?.forEach(album => map[album.id] = album)
        artists?.forEach(artist => map[artist.id] = artist)
        tracks?.forEach(track => map[track.id] = track)
        
        return map
    }, [albums, artists, tracks])
    
    const isLoading = useMemo(() => isAlbumLoading || isArtistLoading || isTrackLoading, [isAlbumLoading, isArtistLoading, isTrackLoading])
    
    return {
        subjectMap,
        isLoading,
        albums,
        artists,
        tracks
    }
}