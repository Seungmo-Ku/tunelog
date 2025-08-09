import { AllJournals } from '@/components/views/journals/all-journals'


const JournalsPage = () => {
    return (
        <div className='w-full h-full flex flex-col overflow-y-scroll hide-sidebar'>
            <AllJournals showMyJournal/>
        </div>
    )
}

export default JournalsPage