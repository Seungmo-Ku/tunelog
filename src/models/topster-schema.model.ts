import mongoose from 'mongoose'
import { replySchema } from '@/models/rating-schema.model'


const componentSchema = new mongoose.Schema({
    type: { type: String, enum: ['album', 'artist', 'track'], required: true },
    spotifyId: { type: String, required: true },
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
}, { _id: false })

const topsterSchema = new mongoose.Schema({
    components: { type: [componentSchema], required: true },
    title: { type: String, required: true },
    size: { type: Number, required: true },
    author: { type: String, required: true },
    showTitles: { type: Boolean, default: false },
    showTypes: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    replies: [replySchema],
    deleted: { type: Boolean, default: false },
    uid: { type: String, required: true },
    public: { type: Boolean, default: false },
    password: { type: String, required: false, default: '' } // TODO. 삭제
}, { timestamps: true })

export const Topster = mongoose.models.Topster || mongoose.model('Topster', topsterSchema)