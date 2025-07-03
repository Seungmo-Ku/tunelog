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
import { Disc, EllipsisVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'


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
    
    const ratingsComponent = useMemo(() => <EllipsisVertical className='text-tunelog-secondary w-5 h-5'/>, [])
    const albumComponent = useMemo(() => <Disc className='text-tunelog-secondary w-5 h-5'/>, [])
    if (isTrackLoading) {
        return <div className='text-white'>Loading...</div>
    }
    return (
        <div className='w-full h-full flex flex-col overflow-y-auto hide-sidebar gap-y-10'>
            <div className='flex gap-x-[27px] justify-start'>
                <img src={track?.album?.images[0].url ?? '/favicon.ico'} alt={track?.name} className='w-[284px] h-[284px] shrink-0 aspect-square rounded-[35px]'/>
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
                                    <div key={`Ratings-${index}`} className='mb-[10px] !w-full group transition active:scale-95'>
                                        <Cards.Long
                                            imgUrl={track?.album?.images[0].url ?? '/favicon.ico'}
                                            title={`${track?.name ?? ''}`}
                                            type={rating.type}
                                            duration={`${rating.score}/5`}
                                            rightIcon={ratingsComponent}
                                            containerClassName='!w-full rounded-none rounded-t-[15px]'
                                        />
                                        <div className='w-full bg-white/50 h-[1px]'/>
                                        <div className='w-full flex flex-col bg-[#33373B] overflow-hidden rounded-b-[15px] p-[10px] text-white text-13-regular gap-y-1'>
                                            <span className='whitespace-pre-line break-keep'>{rating.comment}</span>
                                            <span className='text-12-regular'>{`${new Date(rating.createdAt).toLocaleDateString()} ${rating.author ?? 'Anynomous'}`}</span>
                                            {rating.createdAt !== rating.updatedAt && <span className='text-12-regular'>Last Edited: {new Date(rating.updatedAt).toLocaleDateString()}</span>}
                                        </div>
                                    </div>
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