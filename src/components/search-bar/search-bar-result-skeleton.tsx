export const SearchBarResultSkeleton = () => {
    return (
        <div className='w-full flex p-3 items-center gap-x-3 bg-tunelog-dark-alt/80 rounded-2xl animate-pulse'>
            <div className='w-[60px] h-[60px] shrink-0 aspect-square rounded-lg bg-white/10' />
            <div className='flex flex-col grow gap-y-2'>
                <div className='h-4 w-3/4 rounded bg-white/10' />
                <div className='h-3 w-1/2 rounded bg-white/10' />
            </div>
        </div>
    )
}