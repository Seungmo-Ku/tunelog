import mongoose from 'mongoose'
import { replySchema } from '@/models/rating-schema.model'


const subjectSchema = new mongoose.Schema({
    type: { type: String, enum: ['album', 'artist', 'track'], required: true },
    spotifyId: { type: String, required: true }
}, { _id: false })

const tagsSchema = new mongoose.Schema({
    weather: { type: String, default: '', required: false },
    mood: { type: String, default: '', required: false },
    scene: { type: String, default: '', required: false },
    custom: { type: String, default: '', required: false }
}, { _id: false })

const journalSchema = new mongoose.Schema({
    subjects: { type: [subjectSchema], required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: tagsSchema, required: false },
    author: { type: String, required: false, default: '' },
    isEdited: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    replies: [replySchema],
    deleted: { type: Boolean, default: false },
    uid: { type: String, required: true },
    public: { type: Boolean, default: false }
}, { timestamps: true })

export const Journal = mongoose.models.Journal || mongoose.model('Journal', journalSchema)