import { TopJournal } from '@/components/views/dashboard/top-journal'
import { NewestRatings } from '@/components/views/dashboard/newest-ratings'
import { TopSearchBar } from '@/components/views/dashboard/top-search-bar'


const DashboardPage = () => {
    return (
        <div className='flex flex-col w-full h-full'>
            <TopSearchBar/>
            <div className='flex flex-col gap-y-10 w-full h-full overflow-y-scroll pt-5'>
                
                <div className='grid md:grid-cols-[5fr_3fr] gap-x-5 w-full md:h-[500px]'>
                    <div className='bg-[#609EAF] rounded-[40px] flex justify-center items-center md:h-full h-[300px]'>
                        이건 내용물입니다
                    </div>
                    <div className='flex flex-col w-full gap-y-3 h-[500px]'>
                        <p className='text-24-bold text-white'>Top Journal</p>
                        <TopJournal/>
                    </div>
                </div>
                <div className='flex flex-col gap-y-3'>
                    <h2 className='text-24-bold text-tunelog-light'>Newest Ratings</h2>
                    <NewestRatings/>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage