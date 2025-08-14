'use client'

import { CommunityItem } from '@/libs/interfaces/community.interface'
import { useEffect, useMemo, useState } from 'react'
import { IRating } from '@/libs/interfaces/rating.interface'
import { Journal } from '@/libs/interfaces/journal.interface'
import { useGetAlbumQuery, useGetArtistQuery, useGetTrackQuery } from '@/hooks/use-spotify'
import { Topster } from '@/libs/interfaces/topster.interface'
import { useRouter } from 'next/navigation'


export interface ActivityCalendarImagesProps {
    item: CommunityItem | null | undefined
}

export const ActivityCalendarImages = ({
    item,
    ...props
}: ActivityCalendarImagesProps) => {
    const appRouter = useRouter()
    const [imageType, setImageType] = useState<'artist' | 'track' | 'album' | null>(null)
    const [imageSpotifyId, setImageSpotifyId] = useState<string>('')
    
    useEffect(() => {
        if (!item || !item.item) return
        
        switch (item.type) {
            case 'rating':
                const rating = item.item as IRating
                setImageType(rating.type)
                setImageSpotifyId(rating.spotifyId)
                break
            case 'journal':
                const journal = item.item as Journal
                const subject = journal.subjects[0]
                setImageType(subject.type)
                setImageSpotifyId(subject.spotifyId)
                break
        }
        
    }, [item])
    
    const { data: track, isLoading: isTrackLoading } = useGetTrackQuery(imageType === 'track' ? imageSpotifyId : '')
    const { data: album, isLoading: isAlbumLoading } = useGetAlbumQuery(imageType === 'album' ? imageSpotifyId : '')
    const { data: artist, isLoading: isArtistLoading } = useGetArtistQuery(imageType === 'artist' ? imageSpotifyId : '')
    
    const imageUrl = useMemo(() => {
        if (item?.type === 'topster') return (item.item as Topster).components[0].imageUrl
        switch (imageType) {
            case 'track':
                return !isTrackLoading && track ? track.album?.images?.[0]?.url : undefined
            case 'album':
                return !isAlbumLoading && album ? album.images?.[0]?.url : undefined
            case 'artist':
                return !isArtistLoading && artist ? artist.images?.[0]?.url : undefined
        }
    }, [album, artist, imageType, isAlbumLoading, isArtistLoading, isTrackLoading, item?.item, item?.type, track])
    
    if (!imageUrl || isTrackLoading || isAlbumLoading || isArtistLoading) {
        return (
            <div className='bg-gray-700 animate-pulse rounded-lg aspect-square'/>
        )
    }
    return (
        <img
            {...props}
            alt={imageSpotifyId}
            src={imageUrl}
            className='aspect-square shrink-0 cursor-pointer transition active:scale-95'
            onClick={() => {
                if (!item || !item.item) return
                switch (item.type) {
                    case 'rating':
                        appRouter.push(`/ratings/user/${item.item.uid}`)
                        break
                    case 'journal':
                        appRouter.push(`/journals/${(item.item as Journal)._id}`)
                        break
                    case 'topster':
                        appRouter.push(`/topsters/${(item.item as Topster)._id}`)
                        break
                }
            }}
        />
    )
}