export const CardChartSkeleton = () => {
    return (
        <div className='bg-tunelog-dark-alt w-[417px] shrink-0 rounded-[20px] flex items-center justify-start p-[17px] pr-[21px] gap-x-[14px] animate-pulse'>
            <div className='w-[63px] h-[63px] rounded-[10px] bg-white/10 shrink-0'/>
            <div className='flex flex-col gap-y-2 items-start grow'>
                <div className='flex flex-col gap-y-1 items-start w-full'>
                    <div className='w-[120px] h-[17px] bg-white/10 rounded-[4px]'/>
                    <div className='w-[80px] h-[12px] bg-white/10 rounded-[4px]'/>
                </div>
                <div className='w-full h-[12px] bg-white/10 rounded-[4px]'/>
            </div>
            <div className='p-2 shrink-0 flex items-center justify-center rounded-full border border-white border-opacity-10'>
                <div className='w-[16px] h-[16px] bg-white/10 rounded-full'/>
            </div>
        </div>
    )
}