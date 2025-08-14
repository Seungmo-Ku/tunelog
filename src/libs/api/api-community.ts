import { CommunityQueryType, CommunitySortType } from '@/libs/constants/community.constant'
import { DataConnection } from '@/libs/dto/rating.dto'
import { CommunityResponse } from '@/libs/dto/community.dto'
import axios from 'axios'


const ApiCommunity = {
    _get_community_items: async (limit: number = 10, type: CommunityQueryType = 'all', sort: CommunitySortType = 'newest', filter: 'all' | 'following' = 'all', uid: string | null, date: string | null, nextCursor?: string): Promise<DataConnection<CommunityResponse> | null> => {
        try {
            const params = new URLSearchParams()
            params.append('limit', limit.toString())
            params.append('type', type)
            params.append('sort', sort)
            params.append('filter', filter)
            if (nextCursor) params.append('cursor', nextCursor)
            if (uid) params.append('uid', uid)
            if (date) params.append('date', date)
            
            const { data } = await axios.get<DataConnection<CommunityResponse>>(`/api/community?${params.toString()}`)
            if (!data) return null
            return data
        } catch {
            return null
        }
    }
}

export default ApiCommunity