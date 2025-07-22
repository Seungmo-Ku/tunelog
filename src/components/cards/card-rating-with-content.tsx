'use client'

import { Cards } from '@/components/cards/index'
import { EllipsisVertical } from 'lucide-react'
import { Rating } from '@/libs/interfaces/rating.interface'
import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { useMemo, useState } from 'react'
import { Dialogs } from '@/components/dialogs'
import { useAccount } from '@/libs/utils/account'
import { AccountStatus } from '@/libs/constants/account.constant'
import { useTranslation } from 'react-i18next'


export interface CardRatingWithContentProps {
    rating: Rating | null | undefined
    imgUrl?: string
    title: string
    onClickAction?: () => void
    showMyRating?: boolean
}

export const CardRatingWithContent = ({
    rating,
    imgUrl,
    title,
    onClickAction,
    showMyRating = false,
    ...props
}: CardRatingWithContentProps) => {
    const [deleteRatingOpen, setDeleteRatingOpen] = useState<boolean>(false)
    const [editRatingOpen, setEditRatingOpen] = useState<boolean>(false)
    const { status, me } = useAccount()
    const { t } = useTranslation()
    const ratingsComponent = (
        <Menu>
            <MenuButton
                className='flex p-2 items-center justify-center cursor-pointer'
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                }}>
                <EllipsisVertical className='text-tunelog-secondary w-5 h-5'/>
            </MenuButton>
            <MenuItems transition anchor='bottom end' className='bg-tunelog-dark-alt border border-white/50 rounded-2xl p-4 flex flex-col gap-y-2 transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0 z-[5]'>
                <div className='w-full flex flex-col gap-y-1 items-start text-white cursor-pointer' onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setDeleteRatingOpen(true)
                }}>
                    {t('ratings.card.delete')}
                </div>
                <div className='w-full flex flex-col gap-y-1 items-start text-white cursor-pointer' onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setEditRatingOpen(true)
                }}>
                    {t('ratings.card.edit')}
                </div>
            </MenuItems>
        </Menu>
    )
    
    const isMyRating = useMemo(() => {
        return status !== AccountStatus.guest && me?._id === rating?.uid
    }, [me?._id, rating?.uid, status])
    
    if (!rating) return (
        <Cards.RatingWithContentSkeleton {...props}/>
    )
    return (
        <div
            {...props}
            className='mb-[10px] !w-full group'
            onClick={onClickAction}
        >
            <Cards.Long
                imgUrl={imgUrl ?? '/favicon.ico'}
                title={`${title}`}
                type={rating.type}
                duration={`${rating.score}/5`}
                rightIcon={isMyRating ? ratingsComponent : undefined}
                containerClassName='!w-full rounded-none rounded-t-[15px]'
            />
            <div className='w-full bg-white/50 h-[1px]'/>
            <div className='w-full flex flex-col bg-[#33373B] overflow-hidden rounded-b-[15px] p-[10px] text-white text-13-regular gap-y-1'>
                <span className='whitespace-pre-line break-keep text-left'>{rating.comment}</span>
                <p className='space-x-1'>
                    <span className='text-12-regular text-left'>{`${new Date(rating.createdAt).toLocaleDateString()} ${rating.author ?? 'Anonymous'} | ${rating?.public ? 'Public' : 'Private'}`}</span>
                    {showMyRating && isMyRating && (
                        <span className='text-12-bold text-tunelog-secondary'>{t('ratings.card.my_rating')}</span>
                    )}
                </p>
                
                {rating.createdAt !== rating.updatedAt && <span className='text-12-regular text-left'>{`${t('keywords.last_edited')}: ${new Date(rating.updatedAt).toLocaleDateString()}`}</span>}
            </div>
            <div
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                }}>
                <Dialogs.MutationObject open={deleteRatingOpen} onCloseAction={() => setDeleteRatingOpen(false)} object={rating}/>
                <Dialogs.EditRating open={editRatingOpen} onCloseAction={() => setEditRatingOpen(false)} rating={rating}/>
            </div>
        </div>
    )
}