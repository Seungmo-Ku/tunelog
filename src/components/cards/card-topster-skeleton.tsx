export const CardTopsterSkeleton = () => {
    return (
        <div className='grid w-full shrink-0 grid-cols-[1fr_2fr_1fr_1fr_2fr] backdrop-blur-[5px] bg-[#33373B] mb-[10px] rounded-[15px] p-[10px] items-center animate-pulse gap-x-2'>
            <div className='w-20 h-20 rounded-[8px] bg-gray-700 shrink-0'/>
            <div className='h-4 bg-gray-700 rounded w-3/4'/>
            <div className='h-4 bg-gray-700 rounded w-1/2'/>
            <div className='h-4 bg-gray-700 rounded w-1/4'/>
            <div className='flex flex-col gap-y-2'>
                <div className='h-4 bg-gray-700 rounded w-1/2'/>
                <div className='h-4 bg-gray-700 rounded w-1/4'/>
            </div>
        </div>
    )
}
