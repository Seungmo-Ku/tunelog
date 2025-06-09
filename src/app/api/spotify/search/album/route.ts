// src/app/api/spotify/search/album/route.ts

import axios from 'axios'
import { NextResponse } from 'next/server'
import { getSpotifyToken } from '@/libs/api-server/api-server-spotify'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')
    
    if (!query) {
        return NextResponse.json({ error: 'Missing query' }, { status: 400 })
    }
    
    const token = await getSpotifyToken()
    
    const res = await axios.get(`https://api.spotify.com/v1/search`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            q: query,
            type: 'album',
            limit: 5,
        },
    })
    
    return NextResponse.json(res.data)
}