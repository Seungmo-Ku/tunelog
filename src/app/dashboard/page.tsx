'use client'

import { FeaturedItem } from '@/components/views/dashboard/featured-items'
import { NewestRatings } from '@/components/views/dashboard/newest-ratings'
import { TopJournal } from '@/components/views/dashboard/top-journal'
import { TopSearchBar } from '@/components/views/dashboard/top-search-bar'
import { useRouter } from 'next/navigation'
import React, { useMemo } from 'react'
import { useGetRecommended } from '@/hooks/use-recommended'
import { isEmpty } from 'lodash'
import { useGetAlbumQuery, useGetArtistQuery, useGetTrackQuery } from '@/hooks/use-spotify'
import { useGetJournal } from '@/hooks/use-journal'


const DashboardPage = () => {
    const appRouter = useRouter()
    
    const { data: recommendations, isFetching } = useGetRecommended()
    
    const randomRecommendation = useMemo(() => {
        if (!recommendations || isEmpty(recommendations) || isFetching) return null
        const randomIndex = Math.floor(Math.random() * recommendations.length)
        return recommendations[randomIndex]
    }, [isFetching, recommendations])
    
    const randomRecommendationType = useMemo(() => randomRecommendation?.type, [randomRecommendation])
    
    const { data: track, isFetching: trackFetching } = useGetTrackQuery(randomRecommendationType === 'track' ? randomRecommendation?.spotifyId : undefined)
    const { data: album, isFetching: albumFetching } = useGetAlbumQuery(randomRecommendationType === 'album' ? randomRecommendation?.spotifyId : undefined)
    const { data: artist, isFetching: artistFetching } = useGetArtistQuery(randomRecommendationType === 'artist' ? randomRecommendation?.spotifyId : undefined)
    const { data: journal, isFetching: journalFetching } = useGetJournal(randomRecommendationType === 'journal' ? randomRecommendation?.spotifyId : undefined)
    
    const journalFirstSubject = useMemo(() => {
        if (!recommendations || isEmpty(recommendations) || isFetching || journalFetching || randomRecommendationType !== 'journal') return undefined
        if (!journal || !journal.subjects || isEmpty(journal.subjects)) return undefined
        return journal.subjects[0]
    }, [isFetching, journal, journalFetching, randomRecommendationType, recommendations])
    
    const { data: journalTrack, isFetching: journalTrackFetching } = useGetTrackQuery(journalFirstSubject && journalFirstSubject.type === 'track' ? journalFirstSubject.spotifyId : undefined)
    const { data: journalAlbum, isFetching: journalAlbumFetching } = useGetAlbumQuery(journalFirstSubject && journalFirstSubject.type === 'album' ? journalFirstSubject.spotifyId : undefined)
    const { data: journalArtist, isFetching: journalArtistFetching } = useGetArtistQuery(journalFirstSubject && journalFirstSubject.type === 'artist' ? journalFirstSubject.spotifyId : undefined)
    
    const isAnyFetching = useMemo(() => isFetching || trackFetching || albumFetching || artistFetching || journalFetching || journalAlbumFetching || journalArtistFetching || journalTrackFetching,
        [isFetching, trackFetching, albumFetching, artistFetching, journalFetching, journalAlbumFetching, journalArtistFetching, journalTrackFetching])
    
    const journalImageUrl = useMemo(() => {
        if (isAnyFetching || !journalFirstSubject) return undefined
        switch (journalFirstSubject.type) {
            case 'track':
                return journalTrack?.album?.images?.[0]?.url || 'favicon.ico'
            case 'album':
                return journalAlbum?.images?.[0]?.url || 'favicon.ico'
            case 'artist':
                return journalArtist?.images?.[0]?.url || 'favicon.ico'
            default:
                return 'favicon.ico'
        }
    }, [isAnyFetching, journalAlbum?.images, journalArtist?.images, journalFirstSubject, journalTrack?.album?.images])
    
    const featuredItem = useMemo(() => {
        if (isAnyFetching) return null
        switch (randomRecommendationType) {
            case 'track':
                return track
            case 'artist':
                return artist
            case 'album':
                return album
            case 'journal':
                return journal
            default:
                return null
        }
    }, [isAnyFetching, randomRecommendationType, track, artist, album, journal])
    
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
                    <div className='md:h-full h-[300px] overflow-hidden'> {/* overflow-hidden 추가 */}
                        {!isAnyFetching ? (
                            <FeaturedItem
                                item={featuredItem}
                                imageUrl={journalImageUrl}
                            />
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