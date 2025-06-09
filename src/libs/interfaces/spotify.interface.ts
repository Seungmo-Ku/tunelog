import { AlbumType } from '@/libs/constants/spotify.constant'


export interface ExternalUrls {
    spotify: string
}

export interface IArtist {
    external_urls: ExternalUrls
    href: string
    id: string
    name: string
    type: string
    uri: string
}

export class Artist implements IArtist {
    external_urls: ExternalUrls
    href: string
    id: string
    name: string
    type: string
    uri: string
    
    constructor(artist: IArtist) {
        this.external_urls = artist.external_urls
        this.href = artist.href
        this.id = artist.id
        this.name = artist.name
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
    artists: Artist[]
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
    }
}