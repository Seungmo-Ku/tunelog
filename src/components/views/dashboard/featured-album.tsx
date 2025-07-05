'use client'

import React from 'react'
import { useRouter } from 'next/navigation'


interface FeaturedAlbumProps {
    albumId: string
    imageUrl: string
    title: string
    artist: string
}

export const FeaturedAlbum = ({
    albumId,
    imageUrl,
    title,
    artist
}: FeaturedAlbumProps) => {
    const appRouter = useRouter()
    
    return (
        <div
            className='relative group w-full h-full rounded-[40px] overflow-hidden shadow-lg cursor-pointer'
            onClick={() => appRouter.push(`/detail/album/${albumId}`)}
        >
            {/* 배경 이미지 (앨범 아트) */}
            <div
                className='absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110'
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                {/* 오버레이 */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent'/>
            </div>
            
            {/* 컨텐츠 */}
            <div className='relative z-10 flex flex-col justify-end h-full p-8 text-white'>
                <h3 className='text-sm font-semibold tracking-wider uppercase opacity-80'>Today&#39;s Recommended</h3>
                <h2 className='text-4xl font-bold mt-1'>{title}</h2>
                <p className='text-lg mt-1 opacity-90'>{artist}</p>
                
                <div className='mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='inline-block px-5 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full font-semibold text-sm'>
                        View
                    </div>
                </div>
            </div>
        </div>
    )
}
