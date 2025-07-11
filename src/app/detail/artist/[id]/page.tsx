'use client'

import React, { useMemo } from 'react'
import { useGetArtistAlbumsQuery, useGetArtistQuery, useGetArtistTopTracksQuery } from '@/hooks/use-spotify'
import { Album, Artist, Track } from '@/libs/interfaces/spotify.interface'
import { useGetRatingsBySpotifyId } from '@/hooks/use-rating'
import { useGetJournalsBySpotifyId } from '@/hooks/use-journal'
import _, { isEmpty } from 'lodash'
import { Rating } from '@/libs/interfaces/rating.interface'
import { Journal } from '@/libs/interfaces/journal.interface'
import { useJournalWithObjects } from '@/hooks/use-journal-with-objects'
import { Button } from '@/components/buttons'
import { Cards } from '@/components/cards'
import { useRouter } from 'next/navigation'
import { SearchType } from '@/libs/constants/spotify.constant'


const ArtistDetailWithIdPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const appRouter = useRouter()
    const { id } = React.use(params)
    const { data: artist, isLoading: isArtistLoading } = useGetArtistQuery(id ?? '')
    const { data: albumsData, isLoading: isAlbumLoading } = useGetArtistAlbumsQuery(id ?? '')
    const albums = useMemo(() => {
        if (isAlbumLoading) return []
        return albumsData?.items.map(album => new Album(album)) || []
    }, [albumsData?.items, isAlbumLoading])
    const { data: tracks, isLoading: isTrackLoading } = useGetArtistTopTracksQuery(id ?? '')
    
    const { data: ratingsData, isLoading: isRatingLoading } = useGetRatingsBySpotifyId(artist?.id ?? '', 10)
    const { data: journalsData, isLoading: isJournalLoading } = useGetJournalsBySpotifyId(artist?.id ?? '', 10)
    
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
    
    const isLoading = useMemo(() => isArtistLoading || isAlbumLoading || isTrackLoading, [isArtistLoading, isAlbumLoading, isTrackLoading])
    if (isLoading) {
        return <div className='text-white'>Loading...</div>
    }
    return (
        <div className='w-full h-full flex flex-col overflow-y-auto hide-sidebar gap-y-10'>
            <div className='flex md:flex-row flex-col gap-[27px] md:justify-start'>
                <img src={artist?.images[0].url ?? '/favicon.ico'} alt={artist?.name} className='md:w-[284px] md:h-[284px] w-full shrink-0 aspect-square rounded-[35px]'/>
                <div className='flex flex-col justify-end gap-y-10'>
                    <div className='flex flex-col gap-y-2.5'>
                        <span className='text-36-bold text-[#A4C7C6]'>{`${artist?.name ?? ''}`}</span>
                        {!isEmpty(artist?.genres) && <span className='text-14-regular text-[#EFEEE0]'>{`${artist?.genres.join(', ') ?? ''}`}</span>}
                        <span className='text-14-regular text-[#EFEEE0]'>{`${artist?.followers.total ?? 0} Followers`}</span>
                        <span className='text-14-regular text-[#EFEEE0]'>{`${artist?.popularity ?? 0} Popularity`}</span>
                    </div>
                    <div className='flex gap-x-3'>
                        <Button.Box
                            text='View On Spotify'
                            onClick={() => {
                                if (artist?.external_urls.spotify) {
                                    window.open(artist.external_urls.spotify, '_blank')
                                }
                                //TODO. Spotify icon
                            }}
                        />
                        <Button.MakeRating id={artist?.id} type={SearchType.artist}/>
                    </div>
                </div>
            </div>
            {
                !isEmpty(albums) && (
                    <div className='flex flex-col gap-y-3 w-full'>
                        <span className='text-20-semibold text-white'>{`Albums By ${artist?.name}`}</span>
                        <div className='flex gap-x-3 w-full overflow-x-auto hide-sidebar'>
                            {
                                albums?.map((album) => {
                                    return (
                                        <div onClick={() => appRouter.push(`/detail/album/${album.id}`)} key={`Artist-Albums-${album.id}`}>
                                            <Cards.Big
                                                imgUrl={album.images[0].url ?? '/favicon.ico'}
                                                title={album.name}
                                                subtitle={album.release_date}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            }
            {
                !isEmpty(tracks) && (
                    <div className='flex flex-col gap-y-3 w-full'>
                        <span className='text-20-semibold text-white'>{`${artist?.name}'s Top Tracks`}</span>
                        <div className='flex gap-x-3 w-full overflow-x-auto hide-sidebar'>
                            {
                                tracks?.map((track) => {
                                    return (
                                        <div onClick={() => appRouter.push(`/detail/track/${track.id}`)} key={`Artist-TopTracks-${track.id}`}>
                                            <Cards.Default
                                                imgUrl={track.album?.images[0].url ?? '/favicon.ico'}
                                                title={track.name}
                                                subtitle={track.album?.release_date ?? ''}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
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
                                        imgUrl={artist?.images[0].url ?? '/favicon.ico'}
                                        title={`${artist?.name ?? ''}`}
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

export default ArtistDetailWithIdPage