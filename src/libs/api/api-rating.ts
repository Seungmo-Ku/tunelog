import axios from 'axios'
import { Rating } from '@/libs/interfaces/rating.interface'
import { RatingCreateRequest, RatingResponse } from '@/libs/dto/rating.dto'


const ApiRating = {
    _get_all_ratings: async (limit: number = 10): Promise<Rating[] | null> => {
        try {
            const { data } = await axios.get<RatingResponse[]>(`/api/ratings?limit=${limit}`)
            if (!data) return null
            return data.map(ratingResponse => new Rating(ratingResponse))
        }catch (e) {
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
    },
}

export default ApiRating