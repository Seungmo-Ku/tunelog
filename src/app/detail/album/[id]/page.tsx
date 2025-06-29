'use client'

import React, { useMemo } from 'react'
import { useGetAlbumQuery } from '@/hooks/use-spotify'
import { Button } from '@/components/buttons'
import { isEmpty } from 'lodash'
import { Cards } from '@/components/cards'
import { ArrowUpRight } from 'lucide-react'
import { formatDuration } from '@/libs/utils/time-format'


const AlbumDetailWithIdPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)
    const { data: album, isLoading: isAlbumLoading } = useGetAlbumQuery(id)
    
    const arrowUpRight = useMemo(() => {
        return <ArrowUpRight className='text-white shrink-0'/>
    }, [])
    
    if (isAlbumLoading) {
        return <div className='text-white'>Loading...</div>
    }
    
    return (
        <div className='w-full h-full flex flex-col overflow-y-auto hide-sidebar gap-y-10'>
            <div className='flex gap-x-[27px] justify-start'>
                <img src={album?.images[0].url} alt={album?.name} className='w-[284px] h-[284px] shrink-0 aspect-square rounded-[35px]'/>
                <div className='flex flex-col justify-end gap-y-10'>
                    <div className='flex flex-col gap-y-2.5'>
                        <span className='text-36-bold text-[#A4C7C6]'>{`${album?.name ?? ''} - ${album?.type}`}</span>
                        <span className='text-14-regular text-[#EFEEE0]'>{`${album?.artists.map(artist => artist.name).join(', ')} | Released At ${album?.release_date}`}</span>
                        <span className='text-14-regular text-[#EFEEE0]'>{`Total ${album?.total_tracks ?? 0} tracks`}</span>
                    </div>
                    <div className='flex gap-x-3'>
                        <Button.Box text='View On Spotify'/>
                    </div>
                </div>
            </div>
            {
                !isEmpty(album?.tracks.items) && (
                    <div className='flex flex-col gap-y-3 w-full'>
                        <span className='text-20-semibold text-white'>Tracks</span>
                        {
                            album?.tracks.items.map((track, index) => {
                                return (
                                    <Cards.Long
                                        key={`${track.id} - ${index}`}
                                        imgUrl={album?.images[0].url ?? '/favicon.ico'}
                                        containerClassName='w-full'
                                        title={track.name}
                                        duration={formatDuration(track.duration_ms)}
                                        type={track.artists.map(artist => artist.name).join(', ')}
                                        rightIcon={arrowUpRight}
                                    />
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}

export default AlbumDetailWithIdPage