'use client'

import React from 'react'
import { useGetAlbumQuery } from '@/hooks/use-spotify'
import { Button } from '@/components/buttons'


const AlbumDetailWithIdPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)
    const { data: album, isLoading: isAlbumLoading } = useGetAlbumQuery(id)
    if (isAlbumLoading) {
        return <div className='text-white'>Loading...</div>
    }
    return (
        <div
            className='w-full h-full flex flex-col rounded-2xl bg-opacity-50'
        >
            <div className='flex gap-x-[27px] justify-start'>
                <img src={album?.images[0].url} alt={album?.name} className='w-[284px] h-[284px] shrink-0 aspect-square rounded-[35px]'/>
                <div className='flex flex-col justify-end gap-y-10'>
                    <div className='flex flex-col gap-y-2.5'>
                        <span className='text-36-bold text-[#A4C7C6]'>{album?.name ?? ''}</span>
                        <span className='text-14-regular text-[#EFEEE0]'>{album?.release_date}</span>
                    </div>
                    <div className='flex gap-x-3'>
                        <Button.Box text='View On Spotify'/>
                    </div>
                </div>
            </div>
        
        </div>
    )
}

export default AlbumDetailWithIdPage