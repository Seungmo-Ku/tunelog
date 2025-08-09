import { connectDB } from '@/libs/api-server/mongoose'
import { findUserByCookie } from '@/libs/utils/password'
import { Rating } from '@/models/rating-schema.model'
import { Journal } from '@/models/journal-schema.model'
import { Topster } from '@/models/topster-schema.model'


export const GET = async () => {
    await connectDB()
    const user = await findUserByCookie()
    if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }
    const query = { deleted: false, uid: user._id.toString() }
    const ratingCount = await Rating.find(query).countDocuments() ?? 0
    const journalCount = await Journal.find(query).countDocuments() ?? 0
    const topsterCount = await Topster.find(query).countDocuments() ?? 0
    
    return new Response(JSON.stringify({
        ratingCount,
        journalCount,
        topsterCount
    }), { status: 200 })
}