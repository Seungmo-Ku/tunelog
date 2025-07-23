import { useAccount } from '@/libs/utils/account'
import { Rating } from '@/libs/interfaces/rating.interface'
import { Journal } from '@/libs/interfaces/journal.interface'
import { Topster } from '@/libs/interfaces/topster.interface'
import React, { useCallback, useMemo } from 'react'
import { AccountStatus } from '@/libs/constants/account.constant'
import { Button } from '@/components/buttons'
import { Heart } from 'lucide-react'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useLikeRating, useUnlikeRating } from '@/hooks/use-rating'
import { useLikeJournal, useUnlikeJournal } from '@/hooks/use-journal'
import { useLikeTopster, useUnlikeTopster } from '@/hooks/use-topster'
import { noop } from 'lodash'


interface useLikesProps {
    object: Rating | Journal | Topster | null | undefined
    type: 'rating' | 'journal' | 'topster'
}

export const useLikes = ({
    object, type
}: useLikesProps) => {
    const { status, me } = useAccount()
    const { t } = useTranslation()
    
    const { mutateAsync: likeRating, isPending: isLikeRatingPending } = useLikeRating()
    const { mutateAsync: unlikeRating, isPending: isUnlikeRatingPending } = useUnlikeRating()
    const { mutateAsync: likeJournal, isPending: isLikeJournalPending } = useLikeJournal()
    const { mutateAsync: unlikeJournal, isPending: isUnlikeJournalPending } = useUnlikeJournal()
    const { mutateAsync: likeTopster, isPending: isLikeTopsterPending } = useLikeTopster()
    const { mutateAsync: unlikeTopster, isPending: isUnlikeTopsterPending } = useUnlikeTopster()
    
    const isLikedByUser: boolean = useMemo(() => {
        if (!object || !me || status === AccountStatus.guest) return false
        return object.likedUids?.includes(me._id) ?? false
    }, [me, object, status])
    
    const heartIcon = useMemo(() => {
        return <Heart className={clsx('w-5 h-5 shrink-0', isLikedByUser ? 'fill-red-500' : 'fill-none')}/>
    }, [isLikedByUser])
    
    const isPending = useMemo(() => isLikeRatingPending || isUnlikeRatingPending || isLikeJournalPending || isUnlikeJournalPending || isLikeTopsterPending || isUnlikeTopsterPending,
        [isLikeJournalPending, isLikeRatingPending, isLikeTopsterPending, isUnlikeJournalPending, isUnlikeRatingPending, isUnlikeTopsterPending])
    
    const handleLikes = useCallback(async () => {
        if (isPending) return
        try {
            let res: boolean
            switch (type) {
                case 'rating':
                    if (isLikedByUser) {
                        res = await unlikeRating(object?._id ?? '')
                    } else {
                        res = await likeRating(object?._id ?? '')
                    }
                    break
                case 'journal':
                    if (isLikedByUser) {
                        res = await unlikeJournal(object?._id ?? '')
                    } else {
                        res = await likeJournal(object?._id ?? '')
                    }
                    break
                case 'topster':
                    if (isLikedByUser) {
                        res = await unlikeTopster(object?._id ?? '')
                    } else {
                        res = await likeTopster(object?._id ?? '')
                    }
            }
            res = false
            if (!res) {
                toast.error(t('likes.error'))
            }
        } catch {
            toast.error(t('likes.error'))
        }
    }, [isLikedByUser, isPending, likeJournal, likeRating, likeTopster, object?._id, t, type, unlikeJournal, unlikeRating, unlikeTopster])
    
    const likesButton = useMemo(() => {
        return (
            <Button.Box
                text={`${object?.likedUids?.length ?? 0} likes`}
                rightIcon={heartIcon}
                disabled={isPending}
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (status === AccountStatus.guest) {
                        toast.error(t('likes.guest'))
                        return
                    }
                    handleLikes().then(noop)
                }}
            />
        )
    }, [handleLikes, heartIcon, isPending, object?.likedUids?.length, status, t])
    
    return {
        isLikedByUser,
        likesButton
    }
}