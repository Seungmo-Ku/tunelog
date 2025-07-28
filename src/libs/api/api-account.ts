import { Account } from '@/libs/interfaces/account.interface'
import axios from 'axios'
import { AccountLoginDto, AccountRegisterDto, ObjectCountResponse } from '@/libs/dto/account.dto'


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
    },
    _handle_login: async (account: AccountLoginDto): Promise<{ status: number, message: string }> => {
        try {
            const { userid, password } = account
            const response = await axios.post('/api/accounts/login', { userid }, {
                headers: {
                    'x-login-password': password || ''
                }
            })
            return { status: response.status, message: response.data.message || 'Login successful' }
        } catch {
            return { status: 401, message: 'Invalid userid or password' }
        }
    },
    _handle_logout: async (): Promise<string> => {
        try {
            const response = await axios.post('/api/accounts/logout')
            return response.data.message || 'Logout successful'
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                return 'Unauthorized'
            }
            return 'Internal server error'
        }
    },
    _handle_register: async (account: AccountRegisterDto): Promise<{ status: number, message: string }> => {
        try {
            const response = await axios.post('/api/accounts', account)
            return { status: response.status, message: response.data.message || 'Register successful' }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                return { status: 409, message: 'User already exists' }
            }
            return { status: 500, message: 'Internal server error' }
        }
    },
    _get_my_object_count: async (): Promise<ObjectCountResponse | null> => {
        try {
            const response = await axios.get('/api/accounts/me/get-count')
            if (response.status !== 200) {
                return null
            } else {
                return response.data as ObjectCountResponse
            }
        } catch {
            return null
        }
    },
    _get_others_object_count: async (id: string): Promise<ObjectCountResponse | null> => {
        try {
            const response = await axios.get(`/api/accounts/${id}/get-count`)
            if (response.status !== 200) {
                return null
            } else {
                return response.data as ObjectCountResponse
            }
        } catch {
            return null
        }
    }
}

export default ApiAccount