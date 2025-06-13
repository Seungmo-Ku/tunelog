import { NextRequest, NextResponse } from 'next/server'
import { getSpotifyToken } from '@/libs/api-server/api-server-spotify'
import axios from 'axios'
import { AlbumResponse } from '@/libs/dto/spotify.dto'


export const GET = async (req: NextRequest, context: { params: { id: string } }) => {
    const { id } = await context.params // await 해 줘야 됨
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing album ID' }), { status: 400 })
    }
    
    const token = await getSpotifyToken()
    
    const res = await axios.get<AlbumResponse>(`${process.env.SPOTIFY_ENDPOINT!}/albums/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    
    return NextResponse.json(res.data)
}