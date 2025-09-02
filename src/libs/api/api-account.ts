import { Account } from '@/libs/interfaces/account.interface'
import axios from 'axios'
import { AccountLoginDto, AccountNotify, AccountRegisterDto, AccountResponse, ObjectCountResponse } from '@/libs/dto/account.dto'
import { DataConnection } from '@/libs/dto/rating.dto'


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
    },
    _get_user_following: async (id: string, limit: number = 10, nextCursor?: string): Promise<DataConnection<AccountResponse> | null> => {
        try {
            const params = new URLSearchParams()
            params.append('limit', limit.toString())
            if (nextCursor) params.append('cursor', nextCursor)
            
            const { data } = await axios.get<DataConnection<AccountResponse>>(`/api/accounts/${id}/following?${params.toString()}`)
            if (!data) return null
            return data
        } catch {
            return null
        }
    },
    _get_user_follower: async (id: string, limit: number = 10, nextCursor?: string): Promise<DataConnection<AccountResponse> | null> => {
        try {
            const params = new URLSearchParams()
            params.append('limit', limit.toString())
            if (nextCursor) params.append('cursor', nextCursor)
            
            const { data } = await axios.get<DataConnection<AccountResponse>>(`/api/accounts/${id}/follower?${params.toString()}`)
            if (!data) return null
            return data
        } catch {
            return null
        }
    },
    _get_user_by_id: async (id: string): Promise<Account | null> => {
        try {
            const response = await axios.get(`/api/accounts/${id}`)
            if (response.status !== 200) {
                return null
            } else {
                return new Account(response.data)
            }
        } catch {
            return null
        }
    },
    _follow_user: async (id: string): Promise<boolean> => {
        try {
            const response = await axios.post(`/api/accounts/${id}/following`)
            return response.status === 201
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 400) {
                return false
            }
            return false
        }
    },
    _unfollow_user: async (id: string): Promise<boolean> => {
        try {
            const response = await axios.delete(`/api/accounts/${id}/following`)
            return response.status === 200
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 400) {
                return false
            }
            return false
        }
    },
    _get_notify: async (): Promise<AccountNotify | null> => {
        try {
            const response = await axios.get(`/api/accounts/me/notify`)
            if (response.status !== 200) {
                return null
            } else {
                return response.data as AccountNotify
            }
        } catch {
            return null
        }
    },
    _check_notify: async (id: string): Promise<boolean> => {
        try {
            const response = await axios.patch(`/api/accounts/me/notify/${id}`)
            return response.status === 200
        } catch {
            return false
        }
    }
}

export default ApiAccount