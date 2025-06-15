export const CardBigSkeleton = () => {
    return (
        <div className='w-[200px] h-[234px] shrink-0 rounded-[20px] border border-[#FFFFFF] border-opacity-[0.03] relative animate-pulse bg-tunelog-dark-alt'>
            <div className='w-full h-full rounded-[20px] bg-gray-700' />
            <div className='absolute left-[19px] bottom-[35px] w-[80%] h-[24px] bg-gray-600 rounded-[4px]' />
            <div className='absolute left-[19px] bottom-[22px] w-[40%] h-[14px] bg-gray-600 rounded-[4px] opacity-75' />
        </div>
    )
}