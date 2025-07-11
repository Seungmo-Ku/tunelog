import { Cards } from '@/components/cards/index'


const SkeletonPiece = ({ className }: { className?: string }) => (
    <div className={`bg-gray-600 animate-pulse rounded ${className}`}/>
)

export const CardRatingWithContentSkeleton = () => {
    return (
        <div className='mb-[10px] w-full'>
            <Cards.LongSkeleton containerClassName='!w-full rounded-none rounded-t-[15px] !m-0'/>
            <div className='w-full bg-white/50 h-[1px]'/>
            <div className='w-full flex flex-col bg-[#33373B] rounded-b-[15px] p-[10px] gap-y-2'>
                <SkeletonPiece className='h-3 w-full'/>
                <SkeletonPiece className='h-3 w-11/12'/>
                <div className='h-4'/>
                <SkeletonPiece className='h-3 w-1/3'/>
                <SkeletonPiece className='h-3 w-1/2'/>
            </div>
        </div>
    )
}
