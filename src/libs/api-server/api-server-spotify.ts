
import axios from 'axios'

let cachedToken: string | null = null
let tokenExpiresAt = 0

export const getSpotifyToken = async (): Promise<string> => {
    const now = Date.now()
    
    if (cachedToken && now < tokenExpiresAt) {
        return cachedToken
    }
    
    const clientId = process.env.SPOTIFY_CLIENT_ID!
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    
    const res = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({ grant_type: 'client_credentials' }),
        {
            headers: {
                Authorization: `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    )
    
    cachedToken = res.data.access_token
    tokenExpiresAt = now + res.data.expires_in * 1000 - 60 * 1000 // 만료 1분 전까지 유효
    
    return cachedToken ?? ''
}
//TODO. 캐싱하는 로직 필요