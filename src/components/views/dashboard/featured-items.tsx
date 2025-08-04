'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Album, Artist, Track } from '@/libs/interfaces/spotify.interface'
import { Journal } from '@/libs/interfaces/journal.interface'


interface FeaturedItemProps {
    item: Album | Artist | Track | Journal | null | undefined
    imageUrl?: string // 저널의 경우 이미지를 외부에서 받아와야 함
}

export const FeaturedItem = ({ item, imageUrl: externalImageUrl }: FeaturedItemProps) => {
    const appRouter = useRouter()
    
    if (!item) return null
    
    let id: string, type: string, name: string, details: string, imageUrl: string | undefined
    
    // 'type' 속성이 있는지 확인하여 Journal과 Spotify 아이템을 구분
    if ('type' in item && (item.type === 'album' || item.type === 'artist' || item.type === 'track')) {
        if (item.type === 'album') {
            const album = item as Album
            id = album.id
            type = 'album'
            name = album.name
            details = album.artists.map(a => a.name).join(', ')
            imageUrl = album.images?.[0]?.url
        } else if (item.type === 'artist') {
            const artist = item as Artist
            id = artist.id
            type = 'artist'
            name = artist.name
            details = artist.followers.total + ' followers'
            imageUrl = artist.images?.[0]?.url
        } else { // track
            const track = item as Track
            id = track.id
            type = 'track'
            name = track.name
            details = track.artists.map(a => a.name).join(', ')
            imageUrl = track.album?.images?.[0]?.url
        }
    } else {
        const journal = item as Journal
        id = journal._id
        type = 'journal'
        name = journal.title
        details = `By ${journal.author ?? 'Anonymous'}`
        imageUrl = externalImageUrl // 외부에서 전달받은 이미지 URL 사용
    }
    
    const handleItemClick = () => {
        if (type === 'journal') {
            appRouter.push(`/journals/${id}`)
            return
        }
        appRouter.push(`/detail/${type}/${id}`)
    }
    
    return (
        <div
            className='relative group w-full h-full rounded-[40px] overflow-hidden shadow-lg cursor-pointer'
            onClick={handleItemClick}
        >
            {/* 배경 이미지 */}
            <div
                className='absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110'
                style={{ backgroundImage: `url(${imageUrl || '/default-image.jpg'})` }}
            >
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent'/>
            </div>
            
            {/* 컨텐츠 */}
            <div className='relative z-[1] flex flex-col justify-end h-full p-8 text-white w-full'>
                <h3 className='text-14-semibold tracking-wider uppercase opacity-80 line-clamp-2'>
                    Recommended {type.charAt(0).toUpperCase() + type.slice(1)} For Today
                </h3>
                <h2 className='text-36-bold mt-1 text-ellipsis line-clamp-2 break-keep'>{name}</h2>
                <p className='text-18-regular mt-1 opacity-90 truncate'>{details}</p>
                
                <div className='mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='inline-block px-5 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-14-semibold'>
                        Details
                    </div>
                </div>
            </div>
        </div>
    )
}
