import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    avatar: { type: String },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);