import { SpotifyExample } from '@/components/spotify-example'
import { Suspense } from 'react'
import { connectDB } from '@/libs/api-server/mongoose'


export default function Home() {
    
    // const { data, isLoading } = useSpotifyToken()
    connectDB()
    return (
        <div className=''>
            <Suspense fallback={<div>Loading...</div>}>
                <SpotifyExample/>
            </Suspense>
        </div>
    )
}
