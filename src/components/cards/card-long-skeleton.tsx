export const CardLongSkeleton = () => {
    return (
        <div className='grid w-full shrink-0 grid-cols-[2fr_4fr_4fr_4fr_1fr] backdrop-blur-[5px] bg-[#33373B] mb-[10px] rounded-[15px] p-[10px] items-center animate-pulse gap-x-2'>
            <div className='flex gap-x-[18px] items-center'>
                <div className='w-10 h-10 rounded-[8px] bg-gray-700 shrink-0'/>
                <div className='w-5 h-5 rounded-full bg-gray-700 shrink-0'/>
            </div>
            <div className='h-4 bg-gray-700 rounded w-3/4'/>
            <div className='h-4 bg-gray-700 rounded w-1/2'/>
            <div className='h-4 bg-gray-700 rounded w-1/4'/>
            <div className='h-5 w-5 rounded-full bg-gray-700'/>
        </div>
    )
}