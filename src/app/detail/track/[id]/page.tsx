'use client'

import React, { useMemo } from 'react'
import { useGetTrackQuery } from '@/hooks/use-spotify'
import { useGetRatingsBySpotifyId } from '@/hooks/use-rating'
import { useGetJournalsBySpotifyId } from '@/hooks/use-journal'
import _, { isEmpty } from 'lodash'
import { Rating } from '@/libs/interfaces/rating.interface'
import { Journal } from '@/libs/interfaces/journal.interface'
import { useJournalWithObjects } from '@/hooks/use-journal-with-objects'
import { Button } from '@/components/buttons'
import { Cards } from '@/components/cards'
import { Album, Artist, Track } from '@/libs/interfaces/spotify.interface'
import { Disc } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SearchType } from '@/libs/constants/spotify.constant'


const TrackDetailWithIdPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const appRouter = useRouter()
    const { id } = React.use(params)
    const { data: track, isLoading: isTrackLoading } = useGetTrackQuery(id)
    const { data: ratingsData, isLoading: isRatingLoading } = useGetRatingsBySpotifyId(track?.id ?? '', 10)
    const { data: journalsData, isLoading: isJournalLoading } = useGetJournalsBySpotifyId(track?.id ?? '', 10)
    
    // noinspection DuplicatedCode
    const ratings = useMemo(() => {
        if (isRatingLoading) return []
        const ratingsArray = _.compact(ratingsData?.pages.flatMap(page => page.data) ?? [])
        return ratingsArray?.map(rating => new Rating(rating)) ?? []
    }, [isRatingLoading, ratingsData])
    
    const journals = useMemo(() => {
        if (isJournalLoading) return []
        const journalsArray = _.compact(journalsData?.pages.flatMap(page => page.data) ?? [])
        return journalsArray?.map(journal => new Journal(journal)) ?? []
    }, [isJournalLoading, journalsData])
    
    const { subjectMap } = useJournalWithObjects(journals)
    
    const albumComponent = useMemo(() => <Disc className='text-tunelog-secondary w-5 h-5'/>, [])
    if (isTrackLoading) {
        return <div className='text-white'>Loading...</div>
    }
    return (
        <div className='w-full h-full flex flex-col overflow-y-auto hide-sidebar gap-y-10'>
            <div className='flex md:flex-row flex-col gap-[27px] justify-start'>
                <img src={track?.album?.images[0].url ?? '/favicon.ico'} alt={track?.name} className='md:w-[284px] md:h-[284px] w-full shrink-0 aspect-square rounded-[35px]'/>
                <div className='flex flex-col justify-end gap-y-10'>
                    <div className='flex flex-col gap-y-2.5'>
                        <span className='text-36-bold text-[#A4C7C6]'>{`${track?.name ?? ''}`}</span>
                        {track?.album?.album_type !== 'single' && <span className='text-14-regular text-[#EFEEE0]'>{`At ${track?.album?.name ?? ''}`}</span>}
                        <span className='text-14-regular text-[#EFEEE0]'>{`${track?.artists.map(artist => artist.name).join(', ')} | Released At ${track?.album?.release_date}`}</span>
                        <span className='text-14-regular text-[#EFEEE0]'>{`${track?.popularity ?? 0} Popularity`}</span>
                    </div>
                    <div className='flex gap-x-3'>
                        <Button.Box
                            text='View On Spotify'
                            onClick={() => {
                                if (track?.external_urls.spotify) {
                                    window.open(track.external_urls.spotify, '_blank')
                                }
                                //TODO. Spotify icon
                            }}
                        />
                        {
                            track?.album?.album_type !== 'single' && (
                                <Button.Box
                                    leftIcon={albumComponent}
                                    text='View Album'
                                    onClick={() => {
                                        appRouter.push(`/detail/album/${track?.album?.id}`)
                                    }}
                                />
                            )
                        }
                        <Button.ViewArtist artists={track?.artists}/>
                        <Button.MakeRating id={track?.id} type={SearchType.track}/>
                    </div>
                </div>
            </div>
            {
                !isEmpty(ratings) && (
                    <div className='flex flex-col gap-y-3 w-full'>
                        <span className='text-20-semibold text-white'>Ratings</span>
                        {
                            ratings.map((rating, index) => {
                                return (
                                    <Cards.RatingWithContent
                                        key={`Ratings-${index}`}
                                        imgUrl={track?.album?.images[0].url ?? '/favicon.ico'}
                                        title={`${track?.name ?? ''}`}
                                        rating={rating}
                                    />
                                )
                            })
                        }
                    </div>
                )
            }
            {
                !isEmpty(journals) && (
                    <div className='flex flex-col gap-y-3 w-full'>
                        <span className='text-20-semibold text-white'>Journals</span>
                        <div className='flex gap-x-3 overflow-x-auto hide-sidebar w-full'>
                            {
                                journals.map((journal) => {
                                    const subject = journal.subjects[0]
                                    if (!subject || !subject.spotifyId || !subjectMap[subject.spotifyId])
                                        return (
                                            <Cards.BigSkeleton key={`Journals-${journal._id}`}/>
                                        )
                                    const subjectData = subjectMap[subject.spotifyId]
                                    const imgUrl = subject.type === 'track' ? (subjectData as Track)?.album?.images[0].url : (subjectData as Artist | Album).images[0].url
                                    return (
                                        <div onClick={() => appRouter.push(`/journals/${journal._id}`)} key={`Journals-${journal._id}`}>
                                            <Cards.Big
                                                imgUrl={imgUrl ?? '/favicon.ico'}
                                                title={journal.title}
                                                subtitle={journal.author ?? 'Anonymous'}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default TrackDetailWithIdPage