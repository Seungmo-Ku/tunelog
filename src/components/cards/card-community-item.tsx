'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { CommunityItem } from '@/libs/interfaces/community.interface'
import { IRating } from '@/libs/interfaces/rating.interface'
import { Journal } from '@/libs/interfaces/journal.interface'
import { useGetAlbumQuery, useGetArtistQuery, useGetTrackQuery } from '@/hooks/use-spotify'
import { Topster } from '@/libs/interfaces/topster.interface'
import { capitalizeFirstLetter } from '@/libs/utils/string'
import { useRouter } from 'next/navigation'
import { useAccount } from '@/libs/utils/account'
import { AccountStatus } from '@/libs/constants/account.constant'
import { Cards } from '@/components/cards/index'
import { useLikes } from '@/libs/utils/likes'


export interface CardCommunityItemProps {
    item: CommunityItem | null | undefined
}

export const CardCommunityItem = ({ item, ...props }: CardCommunityItemProps) => {
    const appRouter = useRouter()
    const { status, me } = useAccount()
    const [imageType, setImageType] = useState<'artist' | 'track' | 'album' | null>(null)
    const [imageSpotifyId, setImageSpotifyId] = useState<string>('')
    
    const { likesButton } = useLikes({ object: item?.item, type: item?.type ?? 'rating' })
    
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
    
    if (!item || !item.item) {
        return <Cards.CommunityItemSkeleton/>
    }
    
    const contentsByType = () => {
        let title = ''
        const author = item.item?.author ?? 'Anonymous'
        const date = item.item?.createdAt ? new Date(item.item.createdAt).toLocaleDateString() : 'Unknown Date'
        let content = null
        switch (item.type) {
            case 'rating':
                const rating = item.item as IRating
                switch (imageType) {
                    case 'album':
                        title = album?.name ?? ''
                        break
                    case 'artist':
                        title = artist?.name ?? ''
                        break
                    case 'track':
                        title = track?.name ?? ''
                        break
                }
                content = (
                    <div className='flex flex-col gap-y-1'>
                        <p className='text-tunelog-secondary text-16-semibold'>
                            {`${rating.score}/5`}
                        </p>
                        <p className='text-14-regular text-white line-clamp-4 whitespace-pre-line break-keep'>
                            {rating.comment || 'No comment provided.'}
                        </p>
                    </div>
                )
                break
            case 'journal':
                const journal = item.item as Journal
                title = journal.title ?? ''
                content = (
                    <div
                        className='text-white text-14-regular line-clamp-4 whitespace-pre-line break-keep'
                        dangerouslySetInnerHTML={{ __html: journal?.content ?? '' }}>
                    </div>
                )
                break
            case 'topster':
                const topster = item.item as Topster
                title = topster.title ?? ''
                content = (
                    <div className='flex flex-col gap-y-1'>
                        {
                            topster.components.slice(0, 3).map(component => {
                                return (
                                    <div key={component.spotifyId} className='flex items-center gap-x-2'>
                                        <img src={component.imageUrl ?? '/favicon.ico'} alt={component.title} className='w-10 h-10 rounded'/>
                                        <span className='text-white text-14-regular line-clamp-1'>{component.title}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
                break
        }
        return { title, author, date, content }
    }
    const { title, author, date, content } = contentsByType()
    
    return (
        <div
            {...props}
            className='flex flex-col w-full overflow-hidden transition-all duration-300 ease-in-out bg-white rounded-lg shadow-md active:shadow-xl active:scale-95 cursor-pointer'
            onClick={() => {
                switch (item?.type) {
                    case 'rating':
                        const rating = item.item as IRating
                        if (rating._id) {
                            appRouter.push(`/detail/${imageType}/${rating.spotifyId}`)
                        }
                        break
                    case 'journal':
                        const journal = item.item as Journal
                        if (journal._id) {
                            appRouter.push(`/journals/${journal._id}`)
                        }
                        break
                    case 'topster':
                        const topster = item.item as Topster
                        if (topster._id) {
                            appRouter.push(`/topsters/${topster._id}`)
                        }
                }
            }}
        >
            <div className='relative w-full h-48 bg-gray-200'>
                <img src={imageUrl ?? '/favicon.ico'} alt={title} className='object-cover w-full h-full'/>
                <div className='absolute h-fit right-2 top-1 text-white flex justify-center rounded-4xl bg-black/50 backdrop-blur-[5px]'>
                    {likesButton}
                </div>
            </div>
            
            <div className='flex flex-col flex-grow p-4 bg-tunelog-dark-alt'>
                <span className='text-14-regular text-white'>{capitalizeFirstLetter(item.type)}</span>
                <h3 className='mb-2 text-20-bold text-white line-clamp-2'>{title}</h3>
                <div className='my-2'>
                    {content}
                </div>
            </div>
            
            {/* Footer Section */}
            <div className='px-4 py-3 bg-tunelog-dark flex flex-col'>
                <div className='flex items-center justify-between text-14-regular text-white'>
                    <p className='flex items-center gap-x-1'>
                        <span>By {author}</span>
                        {
                            status !== AccountStatus.guest && me?._id === item.item.uid && (
                                <span className='text-tunelog-secondary text-12-semibold'>{`My ${capitalizeFirstLetter(item.type)}`}</span>
                            )
                        }
                    </p>
                    <span>{date}</span>
                </div>
            </div>
        </div>
    )
}
