import axios from 'axios'
import { AlbumResponse, AlbumsResponse, ArtistResponse, ArtistsResponse, SearchAlbumResponse, SearchItemResponse, SpotifyTokenResponse, TrackResponse, TracksResponse } from '@/libs/dto/spotify.dto'
import { Album, Artist, Track } from '@/libs/interfaces/spotify.interface'


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
    },
    _get_artists: async (ids: string[]): Promise<Artist[] | null> => {
        try {
            const { data } = await axios.get<ArtistsResponse>(`/api/spotify/artists?ids=${ids.join(',')}`)
            if (!data) return null
            return data.artists.map(artistResponse => new Artist(artistResponse))
        }catch (e) {
            console.error('ApiSpotify._get_artists', e)
            return null
        }
    },
    _get_artist: async (id: string): Promise<Artist | null> => {
        try {
            const { data } = await axios.get<ArtistResponse>(`/api/spotify/artists/${id}`)
            if (!data) return null
            return new Artist(data)
        }catch(e) {
            console.error('ApiSpotify._get_artist', e)
            return null
        }
    },
    _get_tracks: async (ids: string[]): Promise<Track[] | null> => {
        try {
            const { data } = await axios.get<TracksResponse>(`/api/spotify/tracks?ids=${ids.join(',')}`)
            if (!data) return null
            return data.tracks.map(trackResponse => new Track(trackResponse))
        }catch (e) {
            console.error('ApiSpotify._get_tracks', e)
            return null
        }
    },
    _get_track: async (id: string): Promise<Track | null> => {
        try {
            const { data } = await axios.get<TrackResponse>(`/api/spotify/tracks/${id}`)
            if (!data) return null
            return new Track(data)
        }catch(e) {
            console.error('ApiSpotify._get_track', e)
            return null
        }
    }
}

export default ApiSpotify