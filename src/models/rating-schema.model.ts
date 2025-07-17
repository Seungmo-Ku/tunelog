import mongoose from 'mongoose'


export const replySchema = new mongoose.Schema({
    comment: { type: String, required: true },
    author: { type: String, required: false, default: '' },
    isEdited: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false }
}, { timestamps: true })

const ratingSchema = new mongoose.Schema({
    type: { type: String, enum: ['album', 'artist', 'track'], required: true },
    spotifyId: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, required: true },
    author: { type: String, required: true },
    isEdited: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    replies: [replySchema],
    deleted: { type: Boolean, default: false },
    uid: { type: String, required: true },
    public: { type: Boolean, default: false }
}, { timestamps: true })

export const Rating = mongoose.models.Rating || mongoose.model('Rating', ratingSchema)