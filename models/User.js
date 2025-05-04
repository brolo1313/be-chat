import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    picture: { type: String },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    role: { type: String, default: "user" },
}, { timestamps: true });

export default mongoose.model('User', userSchema);