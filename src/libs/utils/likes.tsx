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
    
    const isLikedByUser: boolean = useMemo(() => {
        if (!object || !me || status === AccountStatus.guest) return false
        return object.likedUids?.includes(me._id) ?? false
    }, [me, object, status])
    
    const heartIcon = useMemo(() => {
        return <Heart className={clsx('w-5 h-5 shrink-0', isLikedByUser ? 'fill-red-500' : 'fill-none')}/>
    }, [isLikedByUser])
    
    const isPending = useMemo(() => isLikeRatingPending || isUnlikeRatingPending, [isLikeRatingPending, isUnlikeRatingPending])
    
    const handleLikes = useCallback(() => {
        switch (type) {
            case 'rating':
                if (isLikedByUser) {
                    unlikeRating(object?._id ?? '')
                } else {
                    likeRating(object?._id ?? '')
                }
                break
        }
    }, [isLikedByUser, likeRating, object?._id, type, unlikeRating])
    
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
                    handleLikes()
                }}
            />
        )
    }, [handleLikes, heartIcon, isPending, object?.likedUids?.length, status, t])
    
    return {
        isLikedByUser,
        likesButton
    }
}