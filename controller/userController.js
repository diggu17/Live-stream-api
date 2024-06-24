const { User } = require('../model/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "123456";

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await User.create({
            email,
            password: hashedPassword,
            username,
        });
        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during signup:', error); // Log the error
        res.status(500).json({ message: "Something went wrong" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET_KEY, { expiresIn: '1h' });
        return token;
    } catch (error) {
        console.error('Error during login:', error); // Log the error
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = { signup, login };
