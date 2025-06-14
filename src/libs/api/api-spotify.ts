import axios from 'axios'
import { AlbumResponse, AlbumsResponse, SearchAlbumResponse, SearchItemResponse, SpotifyTokenResponse } from '@/libs/dto/spotify.dto'
import { Album } from '@/libs/interfaces/spotify.interface'


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
    _search_all: async (q: string, limit: number = 5): Promise<SearchItemResponse | null> => {
        try {
            const { data } = await axios.get<SearchItemResponse>(`/api/spotify/search?q=${q}&limit=${limit}`)
            return data
        } catch (e) {
            console.error('ApiSpotify._search_all', e)
            return null
        }
    },
    _search_albums: async (q: string, limit: number = 5): Promise<SearchAlbumResponse | null> => {
        try {
            const { data } = await axios.get<SearchAlbumResponse>(`/api/spotify/search/album?q=${q}&limit=${limit}`)
            return data
        } catch (e) {
            console.error('ApiSpotify._search_albums', e)
            return null
        }
    },
    _get_albums: async (ids: string[]): Promise<Album[] | null> => {
        try {
            const { data } = await axios.get<AlbumsResponse>(`/api/spotify/albums?ids=${ids.join(',')}`)
            if (!data) return null
            return data.albums.map(albumResponse => new Album(albumResponse))
        }catch (e) {
            console.error('ApiSpotify._get_albums', e)
            return null
        }
    },
    _get_album: async (id: string): Promise<Album | null> => {
        try {
            const { data } = await axios.get<AlbumResponse>(`/api/spotify/albums/${id}`)
            if (!data) return null
            return new Album(data)
        }catch(e) {
            console.error('ApiSpotify._get_album', e)
            return null
        }
    }
}

export default ApiSpotify