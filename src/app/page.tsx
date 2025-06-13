import { NewestRatings } from '@/components/dashboard/newest-ratings'


export default function Home() {
    return (
        <div className='grid grid-cols-[3fr_2fr] gap-x-5 w-full h-full'>
            <div className='grid grid-rows-[5fr_3fr] gap-y-10'>
                <div className='bg-[#609EAF] rounded-[40px] flex justify-center items-center'>
                    이건 내용물입니다
                </div>
                <div className='flex flex-col gap-y-3'>
                    <h2 className='text-24-bold text-tunelog-light'>Newest Ratings</h2>
                    <NewestRatings/>
                </div>
            
            </div>
            <div className='bg-amber-500 rounded-[40px] flex items-center justify-center'>
                이것도 내용물입니다
            </div>
        </div>
    
    )
}
