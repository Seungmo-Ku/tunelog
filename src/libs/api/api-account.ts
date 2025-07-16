import { Account } from '@/libs/interfaces/account.interface'
import axios from 'axios'


const ApiAccount = {
    _get_me: async (): Promise<Account | null> => {
        try {
            const response = await axios.get('/api/accounts/me')
            if (response.status !== 200) {
                return null
            } else {
                return new Account(response.data)
            }
        } catch {
            return null
        }
    }
}

export default ApiAccount