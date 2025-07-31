import { AllTopsters } from '@/components/views/topsters/all-topsters'


const TopstersPage = () => {
    return (
        <div className='text-white w-full h-full flex flex-col gap-y-10 overflow-y-auto hide-sidebar'>
            <AllTopsters showMyTopster/>
        </div>
    )
}

export default TopstersPage