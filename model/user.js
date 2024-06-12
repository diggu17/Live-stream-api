import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: {type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.pre('save', async (next)=> {
    if (!this.isModified('password')) return next();
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});


const User = mongoose.model('User', userSchema);

export default User;
