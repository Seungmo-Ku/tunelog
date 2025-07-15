import axios from 'axios'
import { TopsterCreateRequest, TopsterDeleteRequest, TopsterResponse, TopsterUpdateRequest } from '@/libs/dto/topster.dto'
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
    _get_topster: async (id: string): Promise<Topster | null> => {
        try {
            const { data } = await axios.get<TopsterResponse>(`/api/topsters/${id}`)
            if (!data) return null
            return new Topster(data)
        } catch (e) {
            console.error('ApiTopster._get_topster', e)
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
    },
    _delete_topster: async (id: string, topster: TopsterDeleteRequest): Promise<boolean> => {
        try {
            const response = await axios.delete(`/api/topsters/${id}`, {
                headers: {
                    'x-delete-topster-password': topster.password || ''
                }
            })
            return response.status === 200
        } catch {
            return false
        }
    },
    _update_topster: async (id: string, topster: TopsterUpdateRequest): Promise<Topster | null> => {
        try {
            const { password, ...rest } = topster
            const response = await axios.patch<TopsterResponse>(`/api/topsters/${id}`, rest, {
                headers: {
                    'x-update-topster-password': password || ''
                }
            })
            if (!response.data || response.status !== 200) return null
            return new Topster(response.data)
        } catch {
            return null
        }
    }
}

export default apiTopster