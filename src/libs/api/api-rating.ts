import axios from 'axios'
import { Rating } from '@/libs/interfaces/rating.interface'
import { DataConnection, RatingCreateRequest, RatingResponse } from '@/libs/dto/rating.dto'


const ApiRating = {
    _get_all_ratings: async (limit: number = 10, nextCursor?: string): Promise<DataConnection<RatingResponse> | null> => {
        try {
            // nextCursor가 있으면 쿼리스트링에 추가
            const params = new URLSearchParams()
            params.append('limit', limit.toString())
            if (nextCursor) params.append('cursor', nextCursor)
            
            const { data } = await axios.get<DataConnection<RatingResponse>>(`/api/ratings?${params.toString()}`)
            if (!data) return null
            return data
        } catch (e) {
            console.error('ApiRating._get_all_ratings', e)
            return null
        }
    },
    _post_rating: async (rating: RatingCreateRequest): Promise<Rating | null> => {
        try {
            const { data } = await axios.post<RatingResponse>('/api/ratings', rating)
            if (!data) return null
            return new Rating(data)
        } catch (e) {
            console.error('ApiRating._post_rating', e)
            return null
        }
    }
}

export default ApiRating