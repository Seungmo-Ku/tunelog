import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import { getSpotifyToken } from '@/libs/api-server/api-server-spotify'
import { SearchItemResponse } from '@/libs/dto/spotify.dto'

export const GET = async(req: NextRequest) => {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')
    const limit = searchParams.get('limit')
    
    if (!query) {
        return NextResponse.json({ error: 'Missing query' }, { status: 400 })
    }
    
    const token = await getSpotifyToken()
    
    const res = await axios.get<SearchItemResponse>(`${process.env.SPOTIFY_ENDPOINT!}/search`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            q: query,
            type: 'album,artist,track',
            limit: limit ? parseInt(limit) : 5,
        },
    })
    
    return NextResponse.json(res.data)
}