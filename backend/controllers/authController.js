import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'supersecretkey';

const authController = {
        register: async (req, res) => {
        try {
            const { name, email, password, address, role } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: "Email already registered." });

            const user = new User({ name, email, password, address, role });
            await user.save();

            res.status(201).json({ success: "User registered successfully." });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if(!email || !password){
                return res.status(400).json({ message: "Please fill required field" });
            }
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ message: "Invalid credentials." });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

            const token = jwt.sign(
                { userId: user._id, role: user.role },
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({ token, id: user._id, success: "Login Successful", name: user.name, email: user.email, role: user.role });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updatePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User.findById(req.user.userId);
            if (!user) return res.status(404).json({ message: "User not found." });

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ message: "Current password is incorrect." });

            user.password = newPassword;
            await user.save();

            res.json({ message: "Password updated successfully." });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default authController;
