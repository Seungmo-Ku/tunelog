import { AllRatings } from '@/components/views/ratings/all-ratings'


const RatingsPage = () => {
    //TODO. 모바일은 컴포넌트를 따로 만들어야 할 듯 하다.
    return (
        <div className='flex flex-col gap-y-10 w-full h-full overflow-y-scroll'>
            <AllRatings />
        </div>
    )
}

export default RatingsPage