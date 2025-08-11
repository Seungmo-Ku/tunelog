import { DataConnection } from '@/libs/dto/rating.dto'
import { ReplyCreateRequest, ReplyResponse } from '@/libs/dto/reply.dto'
import axios from 'axios'


const ApiReply = {
    _get_replies: async (type: 'rating' | 'journal' | 'topster', id: string, limit: number = 10, nextCursor?: string): Promise<DataConnection<ReplyResponse> | null> => {
        try {
            const params = new URLSearchParams()
            params.append('limit', limit.toString())
            if (nextCursor) params.append('cursor', nextCursor)
            
            const { data } = await axios.get<DataConnection<ReplyResponse>>(`/api/${type}s/${id}/reply?${params.toString()}`)
            if (!data) return null
            return data
        } catch (e) {
            console.error('ApiReply._get_replies', e)
            return null
        }
    },
    _post_reply: async (type: 'rating' | 'journal' | 'topster', id: string, reply: ReplyCreateRequest): Promise<ReplyResponse | null> => {
        try {
            const { data } = await axios.post<ReplyResponse>(`/api/${type}s/${id}/reply`, reply)
            if (!data) return null
            return data
        } catch (e) {
            console.error('ApiReply._post_reply', e)
            return null
        }
    },
    _delete_reply: async (type: 'rating' | 'journal' | 'topster', id: string, replyId: string): Promise<boolean> => {
        try {
            const response = await axios.delete(`/api/${type}s/${id}/reply/${replyId}`)
            return response.status === 200
        } catch {
            return false
        }
    }
}

export default ApiReply