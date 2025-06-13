import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import ApiSpotify from '@/libs/api/api-spotify'


export const useGetSpotifyToken = () => {
    return useSuspenseQuery({
        queryKey: ['spotify-token'],
        queryFn: ApiSpotify._get_token,
        staleTime: 1000 * 60 * 60,
        refetchInterval: 1000 * 60 * 60
    })
}
export const useSearchAlbumsQuery = (q: string) => {
    return useQuery({
        queryKey: ['search-album', q],
        queryFn: () => ApiSpotify._search_albums(q),
        enabled: !!q
    })
}
export const useGetAlbumsQuery = (ids: string[]) => {
    return useQuery({
        queryKey: ['albums', ...ids],
        queryFn: () => ApiSpotify._get_albums(ids),
        enabled: !!ids.length
    })
}
export const useGetAlbumQuery = (id: string) => {
    return useQuery({
        queryKey: ['album', id],
        queryFn: () => ApiSpotify._get_album(id),
        enabled: !!id
    })
}