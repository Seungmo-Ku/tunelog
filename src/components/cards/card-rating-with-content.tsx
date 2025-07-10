import { Cards } from '@/components/cards/index'
import { EllipsisVertical } from 'lucide-react'
import { Rating } from '@/libs/interfaces/rating.interface'


export interface CardRatingWithContentProps {
    rating: Rating | null | undefined
    imgUrl?: string
    title: string
    onClickAction?: () => void
}

export const CardRatingWithContent = ({
    rating,
    imgUrl,
    title,
    onClickAction,
    ...props
}: CardRatingWithContentProps) => {
    const ratingsComponent = <EllipsisVertical className='text-tunelog-secondary w-5 h-5'/>
    if (!rating) return (
        <Cards.RatingWithContentSkeleton {...props}/>
    )
    return (
        <button
            {...props}
            className='mb-[10px] !w-full group transition active:scale-95'
            onClick={onClickAction}
        >
            <Cards.Long
                imgUrl={imgUrl ?? '/favicon.io'}
                title={`${title}`}
                type={rating.type}
                duration={`${rating.score}/5`}
                rightIcon={ratingsComponent}
                containerClassName='!w-full rounded-none rounded-t-[15px]'
            />
            <div className='w-full bg-white/50 h-[1px]'/>
            <div className='w-full flex flex-col bg-[#33373B] overflow-hidden rounded-b-[15px] p-[10px] text-white text-13-regular gap-y-1'>
                <span className='whitespace-pre-line break-keep text-left'>{rating.comment}</span>
                <span className='text-12-regular text-left'>{`${new Date(rating.createdAt).toLocaleDateString()} ${rating.author ?? 'Anynomous'}`}</span>
                {rating.createdAt !== rating.updatedAt && <span className='text-12-regular text-left'>Last Edited: {new Date(rating.updatedAt).toLocaleDateString()}</span>}
            </div>
        </button>
    )
}