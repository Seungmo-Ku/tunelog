export interface CardBigProps {
    imgUrl: string
    title: string
    subtitle: string
    showMyJournal?: boolean
}

export const CardBig = ({
    imgUrl,
    title,
    subtitle,
    showMyJournal = false,
    ...props
}: CardBigProps) => {
    return (
        <div {...props} className='w-[200px] h-[234px] shrink-0 rounded-[20px] border border-[#FFFFFF] border-opacity-[0.03] relative transition active:scale-95 cursor-pointer'>
            <img src={imgUrl} alt={imgUrl} className='w-full h-full rounded-[20px] object-cover object-center'/>
            <p className='absolute text-24-regular text-tunelog-light left-[19px] bottom-[35px] text-shadow-lg text-shadow-background line-clamp-2 break-keep'>{title}</p>
            <p className='absolute text-12-bold text-tunelog-light left-[19px] bottom-[22px] opacity-[0.75] text-shadow-lg text-shadow-background space-x-2'>
                <span>{subtitle}</span>
                {showMyJournal && <span className='text-tunelog-secondary'>My Journal</span>}
            </p>
        </div>
    )
}