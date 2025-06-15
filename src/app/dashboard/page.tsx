import { TopSearchBar } from '@/components/views/dashboard/top-search-bar'
import { TopJournal } from '@/components/views/dashboard/top-journal'
import { NewestRatings } from '@/components/views/dashboard/newest-ratings'


const DashboardPage = () => {
    return (
        <div className='w-full h-full flex flex-col gap-y-6'>
            <TopSearchBar />
            <div className='flex flex-col gap-y-10 w-full h-full overflow-y-scroll'>
                <div className='grid grid-cols-[5fr_3fr] gap-x-5 w-full h-[500px]'>
                    <div className='bg-[#609EAF] rounded-[40px] flex justify-center items-center h-full'>
                        이건 내용물입니다
                    </div>
                    <div className='flex flex-col w-full gap-y-3 h-[500px]'>
                        <p className='text-24-bold text-white'>Top Journal</p>
                        <TopJournal />
                    </div>
                </div>
                <div className='flex flex-col gap-y-3'>
                    <h2 className='text-24-bold text-tunelog-light'>Newest Ratings</h2>
                    <NewestRatings />
                </div>
            </div>
        </div>
    )
}

export default DashboardPage