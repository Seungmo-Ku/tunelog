import React, { useMemo } from 'react'
import { useGetAlbumQuery, useGetArtistQuery, useGetTrackQuery } from '@/hooks/use-spotify'
import { useGetJournal } from '@/hooks/use-journal'
import { isEmpty } from 'lodash'
import { Recommended } from '@/libs/interfaces/recommended.interface'
import { FeaturedItem } from '@/components/views/dashboard/featured-items'


interface FeaturedItemsContainerProps {
    slide: Recommended
}

export const FeaturedItemsContainer = ({ slide }: FeaturedItemsContainerProps) => {
    
    const { data: track, isFetching: trackFetching } = useGetTrackQuery(slide.type === 'track' ? slide.spotifyId : undefined)
    const { data: album, isFetching: albumFetching } = useGetAlbumQuery(slide.type === 'album' ? slide.spotifyId : undefined)
    const { data: artist, isFetching: artistFetching } = useGetArtistQuery(slide.type === 'artist' ? slide.spotifyId : undefined)
    const { data: journal, isFetching: journalFetching } = useGetJournal(slide.type === 'journal' ? slide.spotifyId : undefined)
    
    const journalFirstSubject = useMemo(() => {
        if (journalFetching || slide.type !== 'journal') return undefined
        if (!journal || !journal.subjects || isEmpty(journal.subjects)) return undefined
        return journal.subjects[0]
    }, [journal, journalFetching, slide])
    
    const { data: journalTrack, isFetching: journalTrackFetching } = useGetTrackQuery(journalFirstSubject && journalFirstSubject.type === 'track' ? journalFirstSubject.spotifyId : undefined)
    const { data: journalAlbum, isFetching: journalAlbumFetching } = useGetAlbumQuery(journalFirstSubject && journalFirstSubject.type === 'album' ? journalFirstSubject.spotifyId : undefined)
    const { data: journalArtist, isFetching: journalArtistFetching } = useGetArtistQuery(journalFirstSubject && journalFirstSubject.type === 'artist' ? journalFirstSubject.spotifyId : undefined)
    
    const isAnyFetching = useMemo(() => trackFetching || albumFetching || artistFetching || journalFetching || journalAlbumFetching || journalArtistFetching || journalTrackFetching,
        [trackFetching, albumFetching, artistFetching, journalFetching, journalAlbumFetching, journalArtistFetching, journalTrackFetching])
    
    const journalImageUrl = useMemo(() => {
        if (isAnyFetching || !journalFirstSubject) return undefined
        switch (journalFirstSubject.type) {
            case 'track':
                return journalTrack?.album?.images?.[0]?.url || 'favicon.ico'
            case 'album':
                return journalAlbum?.images?.[0]?.url || 'favicon.ico'
            case 'artist':
                return journalArtist?.images?.[0]?.url || 'favicon.ico'
            default:
                return 'favicon.ico'
        }
    }, [isAnyFetching, journalAlbum?.images, journalArtist?.images, journalFirstSubject, journalTrack?.album?.images])
    
    const featuredItem = useMemo(() => {
        if (isAnyFetching) return null
        switch (slide.type) {
            case 'track':
                return track
            case 'artist':
                return artist
            case 'album':
                return album
            case 'journal':
                return journal
            default:
                return null
        }
    }, [isAnyFetching, slide, track, artist, album, journal])
    
    return (
        <FeaturedItem item={featuredItem} imageUrl={journalImageUrl}/>
    )
}