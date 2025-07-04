import { NextRequest, NextResponse } from 'next/server'
import { getSpotifyToken } from '@/libs/api-server/api-server-spotify'
import axios from 'axios'
import { TrackResponse } from '@/libs/dto/spotify.dto'


export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params // await 해 줘야 됨
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing artist ID' }), { status: 400 })
    }
    
    const token = await getSpotifyToken()
    
    const res = await axios.get<TrackResponse>(`${process.env.SPOTIFY_ENDPOINT!}/artists/${id}/top-tracks`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    
    return NextResponse.json(res.data)
}