import axios from 'axios'
import { SearchAlbumResponse, SearchItemResponse, SpotifyTokenResponse } from '@/libs/dto/spotify.dto'


const ApiSpotify = {
    _get_token: async (): Promise<SpotifyTokenResponse | null> => {
        try {
            const { data } = await axios.get('/api/spotify/token')
            return data
        } catch(e) {
            console.error('ApiSpotify._get_token', e)
            return null
        }
    },
    _get_album_list: async (q: string): Promise<SearchAlbumResponse | null> => {
        try {
            const { data } = await axios.get<SearchItemResponse>(`/api/spotify/search/album?q=${q}`)
            return data.albums
        } catch (e) {
            console.error('ApiSpotify._get_album_list', e)
            return null
        }
    }
}

export default ApiSpotify