'use client'

import { FeaturedItem } from '@/components/views/dashboard/featured-items'
import { NewestRatings } from '@/components/views/dashboard/newest-ratings'
import { TopJournal } from '@/components/views/dashboard/top-journal'
import { TopSearchBar } from '@/components/views/dashboard/top-search-bar'
import ApiJournal from '@/libs/api/api-journal'
import ApiRecommended from '@/libs/api/api-recommended'
import ApiSpotify from '@/libs/api/api-spotify'
import { Album, Artist, Track } from '@/libs/interfaces/spotify.interface'
import { Journal } from '@/libs/interfaces/journal.interface'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'


const DashboardPage = () => {
    const appRouter = useRouter()
    const [featuredItem, setFeaturedItem] = useState<Album | Artist | Track | Journal | null>(null)
    const [featuredItemImageUrl, setFeaturedItemImageUrl] = useState<string | undefined>(undefined)
    
    useEffect(() => {
        const fetchFeaturedItem = async () => {
            const recommendations = await ApiRecommended._get_recommended()
            if (!recommendations || recommendations.length === 0) return
            
            const randomIndex = Math.floor(Math.random() * recommendations.length)
            const randomRecommendation = recommendations[randomIndex]
            
            let details: Album | Artist | Track | Journal | null = null
            let imageUrl: string | undefined = undefined
            
            switch (randomRecommendation.type) {
                case 'album':
                    details = await ApiSpotify._get_album(randomRecommendation.spotifyId)
                    break
                case 'artist':
                    details = await ApiSpotify._get_artist(randomRecommendation.spotifyId)
                    break
                case 'track':
                    details = await ApiSpotify._get_track(randomRecommendation.spotifyId)
                    break
                case 'journal':
                    details = await ApiJournal._get_journal(randomRecommendation.spotifyId) // Assuming spotifyId holds the journal ID
                    if (details && (details as Journal).subjects.length > 0) {
                        const subject = (details as Journal).subjects[0]
                        // Now fetch the image for the related subject
                        if (subject.type === 'album') {
                            const album = await ApiSpotify._get_album(subject.spotifyId)
                            imageUrl = album?.images?.[0]?.url
                        } else if (subject.type === 'track') {
                            const track = await ApiSpotify._get_track(subject.spotifyId)
                            imageUrl = track?.album?.images?.[0]?.url
                        } else if (subject.type === 'artist') {
                            const artist = await ApiSpotify._get_artist(subject.spotifyId)
                            imageUrl = artist?.images?.[0]?.url
                        }
                    }
                    break
            }
            setFeaturedItem(details)
            setFeaturedItemImageUrl(imageUrl)
        }
        
        fetchFeaturedItem()
    }, [])
    
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
                        {featuredItem ? (
                            <FeaturedItem item={featuredItem} imageUrl={featuredItemImageUrl}/>
                        ) : (
                             // 로딩 중일 때 보여줄 스켈레톤 UI
                             <div className='w-full h-full bg-gray-700 rounded-[40px] animate-pulse'></div>
                         )}
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