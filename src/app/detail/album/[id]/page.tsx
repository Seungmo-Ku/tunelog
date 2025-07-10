'use client'

import React, { useMemo } from 'react'
import { useGetAlbumQuery } from '@/hooks/use-spotify'
import { Button } from '@/components/buttons'
import _, { isEmpty } from 'lodash'
import { Cards } from '@/components/cards'
import { ArrowUpRight, EllipsisVertical } from 'lucide-react'
import { formatDuration } from '@/libs/utils/time-format'
import { useGetRatingsBySpotifyId } from '@/hooks/use-rating'
import { useGetJournalsBySpotifyId } from '@/hooks/use-journal'
import { Rating } from '@/libs/interfaces/rating.interface'
import { Journal } from '@/libs/interfaces/journal.interface'
import { Album, Artist, Track } from '@/libs/interfaces/spotify.interface'
import { useJournalWithObjects } from '@/hooks/use-journal-with-objects'
import { useRouter } from 'next/navigation'
import { SearchType } from '@/libs/constants/spotify.constant'


const AlbumDetailWithIdPage = ({ params }: { params: Promise<{ id: string }> }) => {
    
    const appRouter = useRouter()
    const { id } = React.use(params)
    const { data: album, isLoading: isAlbumLoading } = useGetAlbumQuery(id)
    const { data: ratingsData, isLoading: isRatingLoading } = useGetRatingsBySpotifyId(album?.id ?? '', 10)
    const { data: journalsData, isLoading: isJournalLoading } = useGetJournalsBySpotifyId(album?.id ?? '', 10)
    
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
    
    const arrowUpRight = useMemo(() => {
        return <ArrowUpRight className='text-white shrink-0'/>
    }, [])
    const ratingsComponent = useMemo(() => <EllipsisVertical className='text-tunelog-secondary w-5 h-5'/>, [])
    
    if (isAlbumLoading) {
        return <div className='text-white'>Loading...</div>
    }
    
    return (
        <div className='w-full h-full flex flex-col overflow-y-auto hide-sidebar gap-y-10'>
            <div className='flex md:flex-row flex-col gap-[27px] justify-start'>
                <img src={album?.images[0].url ?? '/favicon.ico'} alt={album?.name} className='md:w-[284px] md:h-[284px] w-full shrink-0 aspect-square rounded-[35px]'/>
                <div className='flex flex-col justify-end gap-y-10'>
                    <div className='flex flex-col gap-y-2.5'>
                        <span className='text-36-bold text-[#A4C7C6]'>{`${album?.name ?? ''} - ${album?.type}`}</span>
                        <span className='text-14-regular text-[#EFEEE0]'>{`${album?.artists.map(artist => artist.name).join(', ')} | Released At ${album?.release_date}`}</span>
                        <span className='text-14-regular text-[#EFEEE0]'>{`Total ${album?.total_tracks ?? 0} tracks`}</span>
                        <span className='text-14-regular text-[#EFEEE0]'>{`${album?.popularity ?? 0} Popularity`}</span>
                    </div>
                    <div className='flex gap-x-3'>
                        <Button.Box
                            text='View On Spotify'
                            onClick={() => {
                                if (album?.external_urls.spotify) {
                                    window.open(album.external_urls.spotify, '_blank')
                                }
                                {/*Spotify Icon 넣기*/
                                }
                            }}
                        />
                        <Button.ViewArtist artists={album?.artists}/>
                        <Button.MakeRating id={album?.id} type={SearchType.album}/>
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
                                    <div
                                        key={`${track.id} - ${index}`}
                                        onClick={() => {
                                            appRouter.push(`/detail/track/${track.id}`)
                                        }}
                                    >
                                        <Cards.Long
                                            imgUrl={album?.images[0].url ?? '/favicon.ico'}
                                            containerClassName='w-full'
                                            title={track.name}
                                            duration={formatDuration(track.duration_ms)}
                                            type={track.artists.map(artist => artist.name).join(', ')}
                                            rightIcon={arrowUpRight}
                                            showTransitionOnClick
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
            {
                !isEmpty(ratings) && (
                    <div className='flex flex-col gap-y-3 w-full'>
                        <span className='text-20-semibold text-white'>Ratings</span>
                        {
                            ratings.map((rating, index) => {
                                return (
                                    <Cards.RatingWithContent
                                        key={`Ratings-${index}`}
                                        imgUrl={album?.images[0].url ?? '/favicon.ico'}
                                        title={`${album?.name ?? ''}`}
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

export default AlbumDetailWithIdPage