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
export const useSearchAlbumQuery = (q: string) => {
    return useQuery({
        queryKey: ['search-album', q],
        queryFn: () => ApiSpotify._get_album_list(q),
        enabled: !!q
    })
}