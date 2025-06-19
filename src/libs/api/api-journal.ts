import axios from 'axios'
import { Journal } from '@/libs/interfaces/journal.interface'
import { JournalCreateRequest, JournalResponse } from '@/libs/dto/journal.dto'
import { DataConnection } from '@/libs/dto/rating.dto'


const ApiJournal = {
    _get_all_journals: async (limit: number = 10, nextCursor?: string): Promise<DataConnection<JournalResponse> | null> => {
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
    _get_journal: async (id: string): Promise<Journal | null> => {
        try {
            const { data } = await axios.get<JournalResponse>(`/api/journals/${id}`)
            if (!data) return null
            return data
        } catch (e) {
            console.error('ApiJournal._get_journal', e)
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
    }
}

export default ApiJournal