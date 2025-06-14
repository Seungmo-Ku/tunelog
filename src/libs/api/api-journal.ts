import axios from 'axios'
import { Journal } from '@/libs/interfaces/journal.interface'
import { JournalResponse } from '@/libs/dto/journal.dto'


const ApiJournal = {
    _get_all_journals: async (limit: number = 10): Promise<Journal[] | null> => {
        try {
            const { data } = await axios.get<JournalResponse[]>(`/api/journals?limit=${limit}`)
            if (!data) return null
            return data.map(journalResponse => new Journal(journalResponse))
        }catch (e) {
            console.error('ApiJournal._get_all_journals', e)
            return null
        }
    }
}

export default ApiJournal