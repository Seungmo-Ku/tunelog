import axios from 'axios'
import { TopsterCreateRequest, TopsterResponse } from '@/libs/dto/topster.dto'
import { Topster } from '@/libs/interfaces/topster.interface'
import { DataConnection } from '@/libs/dto/rating.dto'


const apiTopster = {
    _get_all_topsters: async (limit: number = 10, nextCursor?: string): Promise<DataConnection<TopsterResponse> | null> => {
        try {
            const params = new URLSearchParams()
            params.append('limit', limit.toString())
            if (nextCursor) params.append('cursor', nextCursor)
            
            const { data } = await axios.get<DataConnection<TopsterResponse>>(`/api/topsters?${params.toString()}`)
            if (!data) return null
            return data
        } catch (e) {
            console.error('ApiTopster._get_all_topsters', e)
            return null
        }
    },
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