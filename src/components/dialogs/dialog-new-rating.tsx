'use client'

import { Dialog, DialogPanel, DialogTitle, Switch, Textarea } from '@headlessui/react'
import { TopSearchBar } from '@/components/views/dashboard/top-search-bar'
import React, { useEffect, useMemo, useState } from 'react'
import { SearchType } from '@/libs/constants/spotify.constant'
import { useGetAlbumQuery, useGetArtistQuery, useGetTrackQuery } from '@/hooks/use-spotify'
import { usePostRating } from '@/hooks/use-rating'
import { Button } from '@/components/buttons'
import { isEmpty } from 'lodash'
import { RatingCreateRequest } from '@/libs/dto/rating.dto'
import { Rating } from 'react-simple-star-rating'
import { useRatingHash } from '@/libs/utils/rating'
import { useAccount } from '@/libs/utils/account'
import { AccountStatus } from '@/libs/constants/account.constant'
import { useTranslation } from 'react-i18next'


interface DialogNewRatingProps {
    open: boolean
    onCloseAction: () => void
}

export const DialogNewRating = ({
    open,
    onCloseAction
}: DialogNewRatingProps) => {
    const { status, me } = useAccount()
    const [selectedObjectId, setSelectedObjectId] = useState<string>('')
    const [selectedType, setSelectedType] = useState<SearchType | null>(null)
    const [comment, setComment] = useState<string>('')
    const [score, setScore] = useState<number>(0)
    const [isPublic, setIsPublic] = useState<boolean>(false)
    const [isOnlyFollowers, setIsOnlyFollowers] = useState<boolean>(false)
    const { t } = useTranslation()
    
    const { mutateAsync, isPending } = usePostRating()
    
    const { data: albumData, isLoading: albumLoading } = useGetAlbumQuery(selectedType === SearchType.album ? selectedObjectId : '')
    const { data: artistData, isLoading: artistLoading } = useGetArtistQuery(selectedType === SearchType.artist ? selectedObjectId : '')
    const { data: trackData, isLoading: trackLoading } = useGetTrackQuery(selectedType === SearchType.track ? selectedObjectId : '')
    
    const { objectId, objectType } = useRatingHash()
    
    useEffect(() => {
        if (objectId) setSelectedObjectId(objectId)
        if (objectType) setSelectedType(objectType)
    }, [objectId, objectType])
    
    const isLoading = useMemo(() => albumLoading || artistLoading || trackLoading, [albumLoading, artistLoading, trackLoading])
    
    const objectImage = useMemo(() => {
        if (!selectedType || !selectedObjectId) return null
        if (isLoading) return (
            <div className='flex items-center gap-x-3'>
                <div className='size-[100px] shrink-0 aspect-square animate-pulse rounded-2xl'/>
                <p className='text-14-regular'>Loading...</p>
            </div>
        )
        const imgUrl = selectedType === SearchType.track ? trackData?.album?.images[0].url : (selectedType === SearchType.artist ? artistData?.images[0].url : albumData?.images[0].url)
        const title = selectedType === SearchType.track ? trackData?.name : (selectedType === SearchType.artist ? artistData?.name : albumData?.name)
        if (!imgUrl || !title) return null
        return (
            <div className='flex items-center gap-x-3'>
                <img src={imgUrl} alt='object_image' className='size-[100px] shrink-0 aspect-square rounded-2xl'/>
                <p className='text-14-regular'>{title}</p>
            </div>
        )
    }, [albumData?.images, albumData?.name, artistData?.images, artistData?.name, isLoading, selectedObjectId, selectedType, trackData?.album?.images, trackData?.name])
    
    if (status === AccountStatus.guest) return null
    
    return (
        <Dialog transition open={open} onClose={onCloseAction} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50'>
                <DialogPanel className='w-3/4 space-y-4 bg-[#33373B] text-white md:p-12 p-4 rounded-2xl flex flex-col'>
                    <DialogTitle className='font-bold'>{t('ratings.new_rating')}</DialogTitle>
                    {objectImage}
                    <TopSearchBar
                        onAlbumClick={() => {
                            setSelectedType(SearchType.album)
                        }}
                        onArtistClick={() => {
                            setSelectedType(SearchType.artist)
                        }}
                        onTrackClick={() => {
                            setSelectedType(SearchType.track)
                        }}
                        setSelectedObjectId={setSelectedObjectId}
                        className={''}
                    />
                    <Rating
                        onClick={setScore}
                        ratingValue={score}
                        size={30}
                    />
                    <Textarea
                        className='w-full py-1 border-white border min-h-[100px]'
                        placeholder={t('ratings.new_rating_dialog.comment')}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={1000}
                    />
                    <div className='flex items-center gap-x-2'>
                        <Switch
                            checked={isPublic}
                            onChange={setIsPublic}
                            className='group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white'
                        >
                            <span
                                aria-hidden='true'
                                className='pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7'
                            />
                        </Switch>
                        <p className='text-14-regular text-white'>{isPublic ? t('ratings.edit_dialog.public') : t('ratings.edit_dialog.private')}</p>
                    </div>
                    {isPublic && <div className='flex items-center gap-x-2'>
                        <Switch
                            checked={isOnlyFollowers}
                            onChange={setIsOnlyFollowers}
                            className='group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white'
                        >
                            <span
                                aria-hidden='true'
                                className='pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7'
                            />
                        </Switch>
                        <p className='text-14-regular text-white'>{isOnlyFollowers ? 'Only visible to followers' : 'Visible to everyone'}</p>
                    </div>}
                    <Button.Box
                        text={t('ratings.new_rating_dialog.create_rating')}
                        disabled={isPending || isEmpty(selectedObjectId) || isEmpty(comment)}
                        onClick={async () => {
                            if (isPending || !selectedType || isEmpty(selectedObjectId) || isEmpty(comment)) return
                            const ratingData: RatingCreateRequest = {
                                spotifyId: selectedObjectId,
                                type: selectedType,
                                author: me?.name ?? '',
                                score,
                                comment,
                                public: isPublic,
                                onlyFollowers: isPublic ? isOnlyFollowers : false
                            }
                            await mutateAsync(ratingData)
                            onCloseAction()
                            setScore(5)
                            setComment('')
                            setSelectedObjectId('')
                            setSelectedType(null)
                        }}
                    />
                </DialogPanel>
            </div>
        </Dialog>
    )
}