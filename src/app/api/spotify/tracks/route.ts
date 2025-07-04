import { NextRequest, NextResponse } from 'next/server'
import { getSpotifyToken } from '@/libs/api-server/api-server-spotify'
import axios from 'axios'
import { TrackResponse } from '@/libs/dto/spotify.dto'


export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)
    const ids = searchParams.get('ids')
    
    if (!ids) {
        return new NextResponse(JSON.stringify({ error: 'Missing query' }), { status: 400 })
    }
    
    const token = await getSpotifyToken()
    
    const res = await axios.get<TrackResponse[]>(`${process.env.SPOTIFY_ENDPOINT!}/tracks`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            ids
        }
    })
    
    return NextResponse.json(res.data)
}