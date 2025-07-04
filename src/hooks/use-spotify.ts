import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import ApiSpotify from '@/libs/api/api-spotify'
import { isEmpty } from 'lodash'


export const useGetSpotifyToken = () => {
    return useSuspenseQuery({
        queryKey: ['spotify-token'],
        queryFn: ApiSpotify._get_token,
        staleTime: 1000 * 60 * 60,
        refetchInterval: 1000 * 60 * 60
    })
}
export const useSearchAllQuery = (q: string, limit?: number) => {
    return useQuery({
        queryKey: ['search-all', q, limit],
        queryFn: () => ApiSpotify._search_all(q, limit ?? 5),
        enabled: !isEmpty(q)
    })
}
export const useSearchAlbumsQuery = (q: string, limit?: number) => {
    return useQuery({
        queryKey: ['search-album', q],
        queryFn: () => ApiSpotify._search_albums(q, limit ?? 5),
        enabled: !isEmpty(q)
    })
}
export const useGetAlbumsQuery = (ids: string[]) => {
    return useQuery({
        queryKey: ['albums', ...ids],
        queryFn: () => ApiSpotify._get_albums(ids),
        enabled: !isEmpty(ids)
    })
}
export const useGetAlbumQuery = (id: string) => {
    return useQuery({
        queryKey: ['album', id],
        queryFn: () => ApiSpotify._get_album(id),
        enabled: !isEmpty(id)
    })
}
export const useGetArtistsQuery = (ids: string[]) => {
    return useQuery({
        queryKey: ['artists', ...ids],
        queryFn: () => ApiSpotify._get_artists(ids),
        enabled: !isEmpty(ids)
    })
}
export const useGetArtistQuery = (id: string) => {
    return useQuery({
        queryKey: ['artist', id],
        queryFn: () => ApiSpotify._get_artist(id),
        enabled: !isEmpty(id)
    })
}
export const useGetArtistAlbumsQuery = (id: string) => {
    return useQuery({
        queryKey: ['artist-album', id],
        queryFn: () => ApiSpotify._get_artist_albums(id),
        enabled: !isEmpty(id)
    })
}
export const useGetTracksQuery = (ids: string[]) => {
    return useQuery({
        queryKey: ['tracks', ...ids],
        queryFn: () => ApiSpotify._get_tracks(ids),
        enabled: !isEmpty(ids)
    })
}
export const useGetTrackQuery = (id: string) => {
    return useQuery({
        queryKey: ['track', id],
        queryFn: () => ApiSpotify._get_track(id),
        enabled: !isEmpty(id)
    })
}