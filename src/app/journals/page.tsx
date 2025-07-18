import { MyJournals } from '@/components/views/journals/my-journals'


const JournalsPage = () => {
    return (
        <div className='w-full h-full flex flex-col overflow-y-scroll hide-sidebar'>
            <MyJournals/>
        </div>
    )
}

export default JournalsPage