export const CardDefaultSkeleton = () => {
    return (
        <div className='flex flex-col gap-y-[5px] items-start w-[153px] shrink-0 animate-pulse'>
            <div className='w-[153px] h-[153px] rounded-[25px] bg-white/10'/>
            <div className='flex justify-between w-[153px]'>
                <div className='h-[12px] w-[80px] bg-white/10 rounded-md'/>
                <div className='h-[12px] w-[40px] bg-white/20 rounded-md'/>
            </div>
            <div className='h-[12px] w-[100px] bg-white/10 rounded-md'/>
        </div>
    )
}