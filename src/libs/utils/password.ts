import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { Account } from '@/models/account-schema.model'


const saltRounds = 10

export const hashPassword = async (password: string): Promise<string> => {
    const hash = await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(password, hash)
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash)
}

export const findUserByCookie = async () => {
    const cookie = await cookies()
    const token = cookie.get('auth')?.value
    if (!token) {
        return null
    }
    let payload
    try {
        const secret = process.env.JWT_SECRET
        if (!secret) {
            throw new Error('JWT_SECRET is not defined')
        }
        const { payload: verified } = await jwtVerify(token, new TextEncoder().encode(secret))
        payload = verified
    } catch {
        return null
    }
    const user = await Account.findById(payload.sub).select('-password -notify')
    if (!user) {
        return null
    }
    return user
}