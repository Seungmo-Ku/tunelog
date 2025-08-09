'use client'

import { NewestRatings } from '@/components/views/dashboard/newest-ratings'
import { TopJournal } from '@/components/views/dashboard/top-journal'
import { TopSearchBar } from '@/components/views/dashboard/top-search-bar'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Carousel } from '@/components/carousel/carousel-featured-item'
import { useGetRecommended } from '@/hooks/use-recommended'
import { FollowingObjects } from '@/components/views/dashboard/following-objects'


const DashboardPage = () => {
    const appRouter = useRouter()
    const { data: recommendations, isFetching } = useGetRecommended()
    
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
                <div className='grid md:grid-cols-[5fr_3fr] gap-5 w-full md:h-[500px]'>
                    <div className='md:h-full h-[300px] overflow-hidden'> {/* overflow-hidden 추가 */}
                        {!isFetching ? (<Carousel slides={recommendations}/>) :
                         (<div className='w-full h-full bg-gray-700 rounded-[40px] animate-pulse'></div>
                         )}
                    </div>
                    <div className='flex flex-col w-full gap-y-3 md:h-[500px]'>
                        <p className='text-24-bold text-white'>Top Journal</p>
                        <TopJournal/>
                    </div>
                </div>
                <FollowingObjects/>
                <div className='flex flex-col gap-y-3'>
                    <h2 className='text-24-bold text-tunelog-light'>Newest Ratings</h2>
                    <NewestRatings/>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage