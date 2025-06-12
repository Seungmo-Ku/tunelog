export interface CardBigProps {
    imgUrl: string
    title: string
    subtitle: string
}

export const CardBig = ({
    imgUrl,
    title,
    subtitle,
    ...props
}: CardBigProps) => {
    return (
        <div {...props} className='w-[213px] h-[234px] shrink-0 rounded-[20px] border border-[#FFFFFF] border-opacity-[0.03] relative'>
            <img src={imgUrl} alt={imgUrl} className='w-full h-full rounded-[20px] object-cover object-center'/>
            <p className='absolute text-24-regular text-tunelog-light left-[19px] bottom-[35px]'>{title}</p>
            <p className='absolute text-10-regular text-tunelog-light left-[19px] bottom-[22px] opacity-[0.75]'>{subtitle}</p>
        </div>
    )
}