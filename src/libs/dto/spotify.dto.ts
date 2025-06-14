import { SearchType } from '@/libs/constants/spotify.constant'
import { IAlbum, IArtist, ITrack } from '@/libs/interfaces/spotify.interface'


export interface SearchItemRequest {
    q: string
    type: SearchType
    market?: string
    limit?: number
    offset?: number
    include_external?: string
}

export interface SearchItemResponse {
    albums: SearchAlbumResponse
    artists: SearchArtistResponse
    tracks: SearchTrackResponse
}

export interface SearchDefaultResponse {
    href: string
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total: number
}
export type SearchAlbumResponse = SearchDefaultResponse & { items: IAlbum[] }
export type SearchArtistResponse = SearchDefaultResponse & { items: IArtist[] }
export type SearchTrackResponse = SearchDefaultResponse & { items: ITrack[] }


export interface SpotifyTokenResponse {
    access_token: string
    token_type: string
    expires_in: number
}

export type AlbumResponse = IAlbum

export interface AlbumsResponse {
    albums: AlbumResponse[]
}