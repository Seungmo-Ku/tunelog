import { AlbumType, SearchType } from '@/libs/constants/spotify.constant'


export interface ExternalUrls {
    spotify: string
}

export interface ITrack {
    album?: Album
    artists: Artist[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids?: {
        isrc: string
        ean: string
        upc: string
    }
    external_urls: ExternalUrls
    href: string
    id: string
    is_playable: boolean
    name: string
    popularity?: number
    track_number: number
    type: SearchType
    uri: string
    is_local: boolean
    restrictions?: {
        reason: string
    }
    // linked_from:
}

export class Track implements ITrack {
    album?: Album
    artists: Artist[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids?: {
        isrc: string
        ean: string
        upc: string
    }
    external_urls: ExternalUrls
    href: string
    id: string
    is_playable: boolean
    name: string
    popularity?: number
    track_number: number
    type: SearchType
    uri: string
    is_local: boolean
    restrictions?: {
        reason: string
    }
    
    constructor(track: ITrack) {
        this.album = track.album ? new Album(track.album) : undefined
        this.artists = track.artists.map(artist => new Artist(artist))
        this.available_markets = track.available_markets
        this.disc_number = track.disc_number
        this.duration_ms = track.duration_ms
        this.explicit = track.explicit
        this.external_ids = track.external_ids
        this.external_urls = track.external_urls
        this.href = track.href
        this.id = track.id
        this.is_playable = track.is_playable
        this.name = track.name
        this.popularity = track.popularity
        this.track_number = track.track_number
        this.type = track.type
        this.uri = track.uri
        this.is_local = track.is_local
        this.restrictions = track.restrictions
    }
}

export interface IArtist {
    external_urls: ExternalUrls
    followers: {
        // href: string | null
        total: number
    }
    genres: string[]
    href: string
    id: string
    images: {
        height: number
        url: string
        width: number
    }[]
    name: string
    popularity: number
    type: string
    uri: string
}

export class Artist implements IArtist {
    external_urls: ExternalUrls
    followers: {
        total: number
    }
    genres: string[]
    href: string
    id: string
    images: {
        height: number
        url: string
        width: number
    }[]
    name: string
    popularity: number
    type: string
    uri: string
    
    constructor(artist: IArtist) {
        this.external_urls = artist.external_urls
        this.followers = artist.followers
        this.genres = artist.genres
        this.href = artist.href
        this.id = artist.id
        this.images = artist.images
        this.name = artist.name
        this.popularity = artist.popularity
        this.type = artist.type
        this.uri = artist.uri
    }
}

export interface IAlbum {
    album_type: AlbumType
    total_tracks: number
    available_markets: string[]
    external_urls: ExternalUrls
    href: string
    id: string
    images: {
        height: number
        url: string
        width: number
    }[]
    name: string
    release_date: string
    release_date_precision: string
    restrictions?: {
        reason: string
    }
    type: string
    uri: string
    artists: IArtist[]
    tracks: {
        href: string
        limit: number
        next: string | null
        offset: number
        previous: string | null
        total: number
        items: ITrack[]
    }
    popularity: number
}

export class Album implements IAlbum {
    album_type: AlbumType
    total_tracks: number
    available_markets: string[]
    external_urls: ExternalUrls
    href: string
    id: string
    images: {
        height: number
        url: string
        width: number
    }[]
    name: string
    release_date: string
    release_date_precision: string
    restrictions?: {
        reason: string
    }
    type: string
    uri: string
    artists: Artist[]
    tracks: {
        href: string
        limit: number
        next: string | null
        offset: number
        previous: string | null
        total: number
        items: Track[]
    }
    popularity: number
    
    constructor(album: IAlbum) {
        this.album_type = album.album_type
        this.total_tracks = album.total_tracks
        this.available_markets = album.available_markets
        this.external_urls = album.external_urls
        this.href = album.href
        this.id = album.id
        this.images = album.images
        this.name = album.name
        this.release_date = album.release_date
        this.release_date_precision = album.release_date_precision
        this.restrictions = album.restrictions
        this.type = album.type
        this.uri = album.uri
        this.artists = album.artists.map(artist => new Artist(artist))
        this.tracks = album.tracks ? {
            href: album.tracks.href,
            limit: album.tracks.limit,
            next: album.tracks.next,
            offset: album.tracks.offset,
            previous: album.tracks.previous,
            total: album.tracks.total,
            items: album.tracks.items.map(track => new Track(track))
        } : {
            href: '',
            limit: 0,
            next: null,
            offset: 0,
            previous: null,
            total: 0,
            items: []
        }
        this.popularity = album.popularity
    }
}