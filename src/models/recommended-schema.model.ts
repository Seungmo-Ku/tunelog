import mongoose from 'mongoose'


const recommendedSchema = new mongoose.Schema({
    type: { type: String, enum: ['album', 'artist', 'track', 'journal'], required: true },
    spotifyId: { type: String, required: true },
    validUntil: { type: Date, default: 0 },
    validFrom: { type: Date, default: 0 },
    deleted: { type: Boolean, default: false }
}, { timestamps: true })

export const Recommended = mongoose.models.Recommended || mongoose.model('Recommended', recommendedSchema)