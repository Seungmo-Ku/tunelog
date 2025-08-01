import axios from 'axios'
import { Rating } from '@/libs/interfaces/rating.interface'
import { DataConnection, RatingCreateRequest, RatingResponse, RatingUpdateRequest } from '@/libs/dto/rating.dto'
import { RatingQueryType, RatingSortType } from '@/libs/constants/rating.constant'


const ApiRating = {
    _get_all_public_ratings: async (limit: number = 10, type: RatingQueryType = 'all', sort: RatingSortType = 'newest', nextCursor?: string): Promise<DataConnection<RatingResponse> | null> => {
        try {
            // nextCursor가 있으면 쿼리스트링에 추가
            const params = new URLSearchParams()
            params.append('limit', limit.toString())
            params.append('type', type)
            params.append('sort', sort)
            if (nextCursor) params.append('cursor', nextCursor)
            
            const { data } = await axios.get<DataConnection<RatingResponse>>(`/api/ratings?${params.toString()}`)
            if (!data) return null
            return data
        } catch {
            return null
        }
    },
    _get_my_ratings: async (limit: number = 10, type: RatingQueryType = 'all', sort: RatingSortType = 'newest', nextCursor?: string): Promise<DataConnection<RatingResponse> | null> => {
        try {
            // nextCursor가 있으면 쿼리스트링에 추가
            const params = new URLSearchParams()
            params.append('limit', limit.toString())
            params.append('type', type)
            params.append('sort', sort)
            if (nextCursor) params.append('cursor', nextCursor)
            
            const { data } = await axios.get<DataConnection<RatingResponse>>(`/api/ratings/my?${params.toString()}`)
            if (!data) return null
            return data
        } catch {
            return null
        }
    },
    _post_rating: async (rating: RatingCreateRequest): Promise<Rating | null> => {
        try {
            const { data } = await axios.post<RatingResponse>('/api/ratings', rating)
            if (!data) return null
            return new Rating(data)
        } catch {
            return null
        }
    },
    _get_ratings_by_spotify_id: async (spotifyId: string, limit: number = 10, nextCursor?: string): Promise<DataConnection<RatingResponse> | null> => {
        try {
            // nextCursor가 있으면 쿼리스트링에 추가
            const params = new URLSearchParams()
            params.append('spotifyId', spotifyId)
            params.append('limit', limit.toString())
            if (nextCursor) params.append('cursor', nextCursor)
            
            const { data } = await axios.get<DataConnection<RatingResponse>>(`/api/ratings/by-spotify-id?${params.toString()}`)
            if (!data) return null
            return data
        } catch (e) {
            console.error('ApiRating._get_ratings_by_spotify_id', e)
            return null
        }
    },
    _delete_rating: async (id: string): Promise<boolean> => {
        try {
            const response = await axios.delete(`/api/ratings/${id}`)
            return response.status === 200
        } catch {
            return false
        }
    },
    _edit_rating: async (id: string, rating: RatingUpdateRequest): Promise<Rating | null> => {
        try {
            const { data } = await axios.patch<RatingResponse>(`/api/ratings/${id}`, rating)
            if (!data) return null
            return new Rating(data)
        } catch {
            return null
        }
    },
    _like_rating: async (id: string): Promise<boolean> => {
        try {
            const response = await axios.post(`/api/ratings/${id}/like`)
            return response.status === 200
        } catch {
            return false
        }
    },
    _unlike_rating: async (id: string): Promise<boolean> => {
        try {
            const response = await axios.delete(`/api/ratings/${id}/like`)
            return response.status === 200
        } catch {
            return false
        }
    }
}

export default ApiRating