import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'


export const findUserIdByCookie = async () => {
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
    return payload.sub
}