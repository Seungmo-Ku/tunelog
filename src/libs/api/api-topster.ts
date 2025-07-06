import axios from 'axios'
import { TopsterCreateRequest, TopsterResponse } from '@/libs/dto/topster.dto'
import { Topster } from '@/libs/interfaces/topster.interface'


const apiTopster = {
    _post_topster: async (topster: TopsterCreateRequest): Promise<Topster | null> => {
        try {
            const { data } = await axios.post<TopsterResponse>('/api/topsters', topster)
            if (!data) return null
            return new Topster(data)
        } catch (e) {
            console.error('ApiTopster._post_topster', e)
            return null
        }
    }
}

export default apiTopster