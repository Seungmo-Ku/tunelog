'use client'

import { CommunityItem } from '@/libs/interfaces/community.interface'
import { useEffect, useMemo, useState } from 'react'
import { IRating } from '@/libs/interfaces/rating.interface'
import { Journal } from '@/libs/interfaces/journal.interface'
import { useGetAlbumQuery, useGetArtistQuery, useGetTrackQuery } from '@/hooks/use-spotify'
import { Topster } from '@/libs/interfaces/topster.interface'
import { useRouter } from 'next/navigation'


export interface ActivityCalendarImagesProps {
    item: CommunityItem[] | null | undefined
}

export const ActivityCalendarImages = ({
    item,
    ...props
}: ActivityCalendarImagesProps) => {
    const appRouter = useRouter()
    const [imageType, setImageType] = useState<'artist' | 'track' | 'album' | null>(null)
    const [imageSpotifyId, setImageSpotifyId] = useState<string>('')
    
    const length = useMemo(() => {
        if (!item) return 0
        return item.length
    }, [item])
    
    useEffect(() => {
        if (!item || !item[0].item) return
        
        switch (item[0].type) {
            case 'rating':
                const rating = item[0].item as IRating
                setImageType(rating.type)
                setImageSpotifyId(rating.spotifyId)
                break
            case 'journal':
                const journal = item[0].item as Journal
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
        if (!item || !item[0] || !item[0].item) return undefined
        if (item[0].type === 'topster') return (item[0].item as Topster).components[0].imageUrl
        switch (imageType) {
            case 'track':
                return !isTrackLoading && track ? track.album?.images?.[0]?.url : undefined
            case 'album':
                return !isAlbumLoading && album ? album.images?.[0]?.url : undefined
            case 'artist':
                return !isArtistLoading && artist ? artist.images?.[0]?.url : undefined
        }
    }, [album, artist, imageType, isAlbumLoading, isArtistLoading, isTrackLoading, item, track])
    
    if (!imageUrl || isTrackLoading || isAlbumLoading || isArtistLoading) {
        return (
            <div className='bg-gray-700 animate-pulse rounded-lg aspect-square'/>
        )
    }
    return (
        <div
            className='aspect-square shrink-0 cursor-pointer transition active:scale-95 relative'
            {...props}
            onClick={() => {
                if (!item || !item[0].item) return
                switch (item[0].type) {
                    case 'rating':
                        const rating = item[0].item as IRating
                        appRouter.push(`/detail/${rating.type}/${rating.spotifyId}`)
                        break
                    case 'journal':
                        appRouter.push(`/journals/${(item[0].item as Journal)._id}`)
                        break
                    case 'topster':
                        appRouter.push(`/topsters/${(item[0].item as Topster)._id}`)
                        break
                }
            }}
        >
            <img
                alt={imageSpotifyId}
                src={imageUrl}
                className='aspect-square'
            />
            {
                length > 1 && (
                    <div className='absolute bottom-0 right-0 bg-black/50 text-white text-xs px-2 py-1 rounded-tl-lg'>
                        {length}
                    </div>
                )
            }
        </div>
    )
}