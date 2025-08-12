import mongoose from 'mongoose'

const notifySchema = new mongoose.Schema({
    info: { type: String, required: true },
    name: { type: String, default: '', required: false },
    type: { type: String, default: '', required: false },
    link: { type: String, default: '', required: false },
}, { timestamps: true })

const accountSchema = new mongoose.Schema({
    userid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    followingUids: { type: [String], default: [] },
    followerUids: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    notify: { type: [notifySchema], default: [] }
}, { timestamps: true })

export const Account = mongoose.models.Account || mongoose.model('Account', accountSchema)