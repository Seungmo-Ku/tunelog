export interface CardDefaultProps {
    imgUrl: string
    title: string
    periphery?: string
    subtitle: string
}

const CardDefault = ({
    imgUrl,
    title,
    subtitle,
    periphery,
    ...props
}: CardDefaultProps) => {
    return (
        <div {...props} className='flex flex-col gap-y-[5px] items-start w-[153px] shrink-0 cursor-pointer transition active:scale-95'>
            <img src={imgUrl} alt={imgUrl} className='w-[153px] h-[153px] rounded-[25px] shrink-0 aspect-square'/>
            <div className='text-12-regular text-white flex justify-between w-[153px]'>
                <p>{title}</p>
                {!!periphery && <p className='text-12-bold text-tunelog-secondary'>{periphery}</p>}
            </div>
            <p className='text-12-regular text-white/50 w-[153px] line-clamp-1'>{subtitle}</p>
        </div>
    )
}

export default CardDefault