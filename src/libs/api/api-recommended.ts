import { Recommended } from '@/libs/interfaces/recommended.interface'
import axios from 'axios'
import { RecommendedResponse } from '@/libs/dto/recommended.dto'
import { isEmpty } from 'lodash'


const ApiRecommended = {
    _get_recommended: async (limit: number = 10): Promise<Recommended[] | null> => {
        try {
            const params = new URLSearchParams()
            params.append('limit', limit.toString())
            const { data } = await axios.get<RecommendedResponse[]>(`/api/recommended?${params.toString()}`)
            if (!data || isEmpty(data)) return null
            return data.map(recommended => new Recommended(recommended))
        } catch (e) {
            console.error('ApiRecommended._get_recommended', e)
            return null
        }
    }
}

export default ApiRecommended