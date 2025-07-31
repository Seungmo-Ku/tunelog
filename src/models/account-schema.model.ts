import mongoose from 'mongoose'


const accountSchema = new mongoose.Schema({
    userid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    followingUids: { type: [String], default: [] },
    followerUids: { type: [String], default: [] },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

export const Account = mongoose.models.Account || mongoose.model('Account', accountSchema)