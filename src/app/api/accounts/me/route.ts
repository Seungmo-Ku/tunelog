import { connectDB } from '@/libs/api-server/mongoose'
import { findUserByCookie } from '@/libs/utils/password'


export const GET = async () => {
    await connectDB()
    const user = await findUserByCookie()
    if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }
    delete user.password
    return new Response(JSON.stringify(user), { status: 200 })
}