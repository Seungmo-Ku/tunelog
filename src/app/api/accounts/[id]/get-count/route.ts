import { NextRequest } from 'next/server'
import { Rating } from '@/models/rating-schema.model'
import { Journal } from '@/models/journal-schema.model'
import { Topster } from '@/models/topster-schema.model'


export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing account ID' }), { status: 400 })
    }
    
    const query = { deleted: false, uid: id, public: true }
    const ratingCount = await Rating.find(query).countDocuments() ?? 0
    const journalCount = await Journal.find(query).countDocuments() ?? 0
    const topsterCount = await Topster.find(query).countDocuments() ?? 0
    
    return new Response(JSON.stringify({
        ratingCount,
        journalCount,
        topsterCount
    }), { status: 200 })
}