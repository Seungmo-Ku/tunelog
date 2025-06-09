// app/api/token/route.ts
import { NextResponse } from 'next/server'
import axios from 'axios'

export const GET = async () => {
    const clientId = process.env.SPOTIFY_CLIENT_ID!
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({ grant_type: 'client_credentials' }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${authString}`,
                },
            }
        )
        
        return NextResponse.json(response.data)
    } catch (error) {
        console.error('Error fetching token:', error)
        return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 })
    }
}