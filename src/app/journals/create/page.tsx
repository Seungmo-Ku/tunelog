import { CreatingComponent } from '@/components/views/journals/creating-component'


const JournalCreatePage = () => {
    return (
        <div className='flex flex-col w-full h-full overflow-y-auto hide-sidebar'>
            <CreatingComponent />
        </div>
    )
}

export default JournalCreatePage