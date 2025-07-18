import axios from 'axios'
import { Journal } from '@/libs/interfaces/journal.interface'
import { JournalCreateRequest, JournalResponse, JournalUpdateRequest } from '@/libs/dto/journal.dto'
import { DataConnection } from '@/libs/dto/rating.dto'


const ApiJournal = {
    _get_all_public_journals: async (limit: number = 10, nextCursor?: string): Promise<DataConnection<JournalResponse> | null> => {
        try {
            const params = new URLSearchParams()
            params.append('limit', limit.toString())
            if (nextCursor) params.append('cursor', nextCursor)
            
            const { data } = await axios.get<DataConnection<JournalResponse>>(`/api/journals?${params.toString()}`)
            if (!data) return null
            return data
        } catch (e) {
            console.error('ApiJournal._get_all_journals', e)
            return null
        }
    },
    _get_my_journals: async (limit: number = 10, nextCursor?: string): Promise<DataConnection<JournalResponse> | null> => {
        try {
            const params = new URLSearchParams()
            params.append('limit', limit.toString())
            if (nextCursor) params.append('cursor', nextCursor)
            
            const { data } = await axios.get<DataConnection<JournalResponse>>(`/api/journals/my?${params.toString()}`)
            if (!data) return null
            return data
        } catch {
            return null
        }
    },
    _get_journal: async (id: string): Promise<Journal | null> => {
        try {
            const { data } = await axios.get<JournalResponse>(`/api/journals/${id}`)
            if (!data) return null
            return data
        } catch {
            return null
        }
    },
    _post_journal: async (rating: JournalCreateRequest): Promise<Journal | null> => {
        try {
            const { data } = await axios.post<JournalResponse>('/api/journals', rating)
            if (!data) return null
            return new Journal(data)
        } catch (e) {
            console.error('ApiJournal._post_journal', e)
            return null
        }
    },
    _get_journals_by_spotify_id: async (spotifyId: string, limit: number = 10, nextCursor?: string): Promise<DataConnection<JournalResponse> | null> => {
        try {
            // nextCursor가 있으면 쿼리스트링에 추가
            const params = new URLSearchParams()
            params.append('spotifyId', spotifyId)
            params.append('limit', limit.toString())
            if (nextCursor) params.append('cursor', nextCursor)
            
            const { data } = await axios.get<DataConnection<JournalResponse>>(`/api/journals/by-spotify-id?${params.toString()}`)
            if (!data) return null
            return data
        } catch (e) {
            console.error('ApiJournal._get_journals_by_spotify_id', e)
            return null
        }
    },
    _delete_journal: async (id: string): Promise<boolean> => {
        try {
            const response = await axios.delete(`/api/journals/${id}`)
            return response.status === 200
        } catch {
            return false
        }
    },
    _update_journal: async (id: string, journal: JournalUpdateRequest): Promise<Journal | null> => {
        try {
            const response = await axios.patch<JournalResponse>(`/api/journals/${id}`, journal)
            if (!response.data || response.status !== 200) return null
            return new Journal(response.data)
        } catch {
            return null
        }
    }
}

export default ApiJournal