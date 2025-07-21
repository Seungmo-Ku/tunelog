'use client'


import { useGetCommunityItems } from '@/hooks/use-community'


const CommunityPage = () => {
    const { data } = useGetCommunityItems()
    console.log('CommunityPage data:', data)
    return (
        <div>
        
        </div>
    )
}

export default CommunityPage