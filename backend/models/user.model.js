import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 8,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 16,
        match: [/(?=.*[A-Z])(?=.*[!@#$%^&*])/, 'Password must contain at least one uppercase letter and one special character']
    },
    address: {
        type: String,
        required: true,
        maxlength: 400
    },
    role: {
        type: String,
        enum: ['user', 'Admin', 'Store Owner'],
        default: 'user'
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);
export default User;
