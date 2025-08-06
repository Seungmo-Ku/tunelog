import { CreatingJournal } from '@/components/views/journals/creating-journal'


const JournalCreatePage = () => {
    return (
        <div className='flex flex-col w-full h-full overflow-y-auto hide-sidebar'>
            <CreatingJournal />
        </div>
    )
}

export default JournalCreatePage