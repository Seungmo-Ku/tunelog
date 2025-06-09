import { SearchType } from '@/libs/constants/spotify.constant'
import { IAlbum } from '@/libs/interfaces/spotify.interface'


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
}

export interface SearchAlbumResponse {
    href: string
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total: number
    items: IAlbum[]
}

export interface SpotifyTokenResponse {
    access_token: string
    token_type: string
    expires_in: number
}
