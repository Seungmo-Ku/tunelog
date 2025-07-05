'use client'

import { TopJournal } from '@/components/views/dashboard/top-journal'
import { NewestRatings } from '@/components/views/dashboard/newest-ratings'
import { TopSearchBar } from '@/components/views/dashboard/top-search-bar'
import React from 'react'
import { useRouter } from 'next/navigation'
import { FeaturedAlbum } from '@/components/views/dashboard/featured-album'


const DashboardPage = () => {
    const appRouter = useRouter()
    
    return (
        <div className='flex flex-col w-full h-full'>
            <TopSearchBar
                onAlbumClick={(id?: string) => {
                    if (!id) return
                    appRouter.push(`/detail/album/${id}`)
                }}
                onTrackClick={(id?: string) => {
                    if (!id) return
                    appRouter.push(`/detail/track/${id}`)
                }}
                onArtistClick={(id?: string) => {
                    if (!id) return
                    appRouter.push(`/detail/artist/${id}`)
                }}
            />
            <div className='flex flex-col gap-y-10 w-full h-full overflow-y-scroll pt-5'>
                
                <div className='grid md:grid-cols-[5fr_3fr] gap-x-5 w-full md:h-[500px]'>
                    <div className='md:h-full h-[300px]'>
                        <FeaturedAlbum 
                            albumId='2cADR2leWH3_3ab3d5z5'
                            imageUrl='https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop'
                            title='Currents'
                            artist='Tame Impala'
                        />
                    </div>
                    <div className='flex flex-col w-full gap-y-3 md:h-[500px]'>
                        <p className='text-24-bold text-white'>Top Journal</p>
                        <TopJournal/>
                    </div>
                </div>
                <div className='flex flex-col gap-y-3'>
                    <h2 className='text-24-bold text-tunelog-light'>Newest Ratings</h2>
                    <NewestRatings/>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage