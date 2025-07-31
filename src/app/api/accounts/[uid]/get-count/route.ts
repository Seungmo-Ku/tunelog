import { NextRequest } from 'next/server'
import { Rating } from '@/models/rating-schema.model'
import { Journal } from '@/models/journal-schema.model'
import { Topster } from '@/models/topster-schema.model'
import { findUserByCookie } from '@/libs/utils/password'


export const GET = async (req: NextRequest, { params }: { params: Promise<{ uid: string }> }) => {
    const { uid } = await params
    if (!uid) {
        return new Response(JSON.stringify({ error: 'Missing account ID' }), { status: 400 })
    }
    const user = await findUserByCookie()
    
    const query = (user && user._id.toString() === uid) ? { deleted: false, uid: uid } : { deleted: false, uid: uid, public: true }
    const ratingCount = await Rating.find(query).countDocuments() ?? 0
    const journalCount = await Journal.find(query).countDocuments() ?? 0
    const topsterCount = await Topster.find(query).countDocuments() ?? 0
    
    return new Response(JSON.stringify({
        ratingCount,
        journalCount,
        topsterCount
    }), { status: 200 })
}