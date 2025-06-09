import { SpotifyExample } from '@/components/spotify-example'
import { Suspense } from 'react'


export default function Home() {
    
    // const { data, isLoading } = useSpotifyToken()
    
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <SpotifyExample/>
            </Suspense>
        </div>
    )
}
