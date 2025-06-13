import axios from 'axios'
import { Rating } from '@/libs/interfaces/rating.interface'
import { RatingResponse } from '@/libs/dto/rating.dto'


const ApiRating = {
    _get_all_ratings: async (): Promise<Rating[] | null> => {
        try {
            const { data } = await axios.get<RatingResponse[]>('/api/ratings')
            if (!data) return null
            return data.map(ratingResponse => new Rating(ratingResponse))
        }catch (e) {
            console.error('ApiRating._get_all_ratings', e)
            return null
        }
    }
}

export default ApiRating