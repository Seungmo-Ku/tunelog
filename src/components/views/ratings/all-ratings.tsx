'use client'

import { useGetMyRatings, useGetUserRatings } from '@/hooks/use-rating'
import { useRatingWithObjects } from '@/hooks/use-rating-with-objects'
import { Cards } from '@/components/cards'
import { SearchType } from '@/libs/constants/spotify.constant'
import { FilterButtons } from '@/components/views/ratings/filter-buttons'
import { useEffect, useMemo, useState } from 'react'
import { SortingButtons } from '@/components/views/ratings/sorting-buttons'
import { Button } from '@/components/buttons'
import { Plus, Star } from 'lucide-react'
import { Dialogs } from '@/components/dialogs'
import { Rating } from '@/libs/interfaces/rating.interface'
import { useInView } from 'react-intersection-observer'
import { isEmpty, noop } from 'lodash'
import { useRouter } from 'next/navigation'
import { useAtom, useSetAtom } from 'jotai'
import { MakeRatingAtom } from '@/components/buttons/button-make-rating'
import { useRatingHash } from '@/libs/utils/rating'
import { useAccount } from '@/libs/utils/account'
import { DialogLoginAtom } from '@/components/dialogs/dialog-login'
import { AccountStatus } from '@/libs/constants/account.constant'
import { useTranslation } from 'react-i18next'


interface AllRatingsProps {
    showMyRating: boolean
    uid?: string | null | undefined
}

export const AllRatings = ({
    showMyRating = true,
    uid
}: AllRatingsProps) => {
    const appRouter = useRouter()
    const { status } = useAccount()
    const [filterIndex, setFilterIndex] = useState(0)
    const [sortingIndex, setSortingIndex] = useState(0)
    const [newRatingOpen, setNewRatingOpen] = useState(false)
    const [makeRating, setMakeRating] = useAtom(MakeRatingAtom)
    const setLoginDialogOpen = useSetAtom(DialogLoginAtom)
    const { t } = useTranslation()
    
    const selectedFilter = useMemo(() => {
        switch (filterIndex) {
            case 0:
                return 'all'
            case 1:
                return SearchType.album
            case 2:
                return SearchType.artist
            case 3:
            default:
                return SearchType.track
        }
    }, [filterIndex])
    
    const selectedSorting = useMemo(() => {
        switch (sortingIndex) {
            case 0:
                return 'newest'
            case 1:
            default:
                return 'oldest'
        }
    }, [sortingIndex])
    
    const { data: myRatingsData, fetchNextPage: myFetchNextPage, hasNextPage: myHasNextPage, isFetchingNextPage: isMyFetchingNextPage, isLoading: isMyRatingLoading } = useGetMyRatings(20, selectedFilter, selectedSorting, showMyRating)
    const { data: userRatingsData, fetchNextPage: userFetchNextPage, hasNextPage: userHasNextPage, isFetchingNextPage: userIsFetchingNextPage, isLoading: isUserRatingLoading } = useGetUserRatings(uid ?? '', 20, selectedFilter, selectedSorting, !showMyRating)
    
    const ratings = useMemo(() => {
        if (showMyRating) {
            if (isMyRatingLoading) return []
            const ratingsArray = myRatingsData?.pages.flatMap(page => page.data) ?? []
            return ratingsArray?.map(rating => new Rating(rating)) ?? []
        } else {
            if (isUserRatingLoading) return []
            const ratingsArray = userRatingsData?.pages.flatMap(page => page.data) ?? []
            return ratingsArray?.map(rating => new Rating(rating)) ?? []
        }
    }, [isMyRatingLoading, isUserRatingLoading, myRatingsData?.pages, showMyRating, userRatingsData?.pages])
    
    const { ref, inView } = useInView()
    
    useEffect(() => {
        if (inView) {
            if (showMyRating && !isMyFetchingNextPage && myHasNextPage)
                myFetchNextPage().then(noop)
            else if (!showMyRating && !userIsFetchingNextPage && userHasNextPage)
                userFetchNextPage().then(noop)
        }
    }, [inView, isMyFetchingNextPage, myFetchNextPage, myHasNextPage, showMyRating, userFetchNextPage, userHasNextPage, userIsFetchingNextPage])
    
    const { objectId, objectType } = useRatingHash()
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!makeRating) {
                history.replaceState(null, '', window.location.pathname)
                return
            }
            if (objectId && objectType && makeRating) {
                setMakeRating(false)
                setTimeout(() => {
                    setNewRatingOpen(true)
                }, 500)
            }
        }
    }, [makeRating, objectId, objectType, setMakeRating])
    
    const { albumsById, tracksById, artistsById } = useRatingWithObjects(ratings)
    
    const PlusIcon = useMemo(() => <Plus className='w-5 h-5 text-tunelog-secondary'/>, [])
    
    return (
        <div className='flex flex-col gap-y-10 relative w-full overflow-x-hidden'>
            <div className='w-full flex md:flex-row flex-col  gap-x-5 gap-y-4'>
                <FilterButtons filterIndex={filterIndex} setFilterIndexAction={setFilterIndex}/>
                <div className='w-[1px] h-full bg-white md:flex hidden'/>
                <SortingButtons sortingIndex={sortingIndex} setSortingIndexAction={setSortingIndex}/>
                <div className='w-[1px] h-full bg-white md:flex hidden'/>
                {showMyRating && <Button.Box
                    text={t('ratings.new_rating')}
                    leftIcon={PlusIcon}
                    className='text-14-regular w-fit h-10'
                    onClick={() => {
                        if (status === AccountStatus.guest) {
                            setLoginDialogOpen((prev) => (
                                { ...prev, open: true }
                            ))
                        }
                        setNewRatingOpen(true)
                    }}
                />}
            </div>
            <div className='flex flex-col w-full'>
                {
                    isEmpty(ratings) && (
                        isMyRatingLoading ?
                        Array.from({ length: 5 }).map((_, index) => (
                            <Cards.LongSkeleton key={`AllRatings-Skeleton-${index}`}/>
                        )) :
                        <div className='flex flex-col items-center justify-center w-full py-20 text-center gap-y-4'>
                            <Star className='w-10 h-10 text-white'/>
                            <div className='flex flex-col gap-y-1'>
                                <p className='text-16-bold text-white'>{t('ratings.no_rating_yet')}</p>
                                {showMyRating && <p className='text-14-regular text-tunelog-secondary'>{t('ratings.leave_rating')}</p>}
                            </div>
                        </div>
                    )
                }
                {
                    !isMyRatingLoading && !isEmpty(ratings) &&
                    ratings?.map((rating, index) => {
                        let imgUrl: string = '', title: string = ''
                        if (!rating.spotifyId || !rating.type) {
                            return <Cards.LongSkeleton key={`AllRatings-Skeleton-in-${index}`}/>
                        }
                        switch (rating.type) {
                            case SearchType.album:
                                const album = albumsById[rating.spotifyId] ?? null
                                imgUrl = album?.images[0].url ?? ''
                                title = album?.name ?? ''
                                break
                            case SearchType.artist:
                                const artist = artistsById[rating.spotifyId] ?? null
                                imgUrl = artist?.images[0].url ?? ''
                                title = artist?.name ?? ''
                                break
                            case SearchType.track:
                                const track = tracksById[rating.spotifyId] ?? null
                                imgUrl = track?.album?.images[0].url ?? ''
                                title = track?.name ?? ''
                        }
                        if (isEmpty(imgUrl) || isEmpty(title)) {
                            return <Cards.RatingWithContentSkeleton key={`AllRatings-${index}`}/>
                        }
                        return (
                            <Cards.RatingWithContent
                                key={`AllRatings-${index}`}
                                rating={rating}
                                imgUrl={imgUrl}
                                title={title}
                                onClickAction={() => {
                                    appRouter.push(`/detail/${rating.type}/${rating.spotifyId}`)
                                }}
                            />
                        )
                    })
                }
                <div ref={ref}/>
                {
                    (isMyFetchingNextPage || userIsFetchingNextPage) &&
                    <Cards.LongSkeleton/>
                }
            </div>
            <Dialogs.NewRating
                open={newRatingOpen}
                onCloseAction={() => setNewRatingOpen(false)}
            />
        </div>
    
    )
}