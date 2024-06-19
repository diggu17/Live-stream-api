import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = "123456";

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body);
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await User.create({
            email: email,
            password: hashedPassword,
            username: username,
        });

        const token = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY, { expiresIn: '1h' });

        res.status(201).json({ user: result, token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ user: existingUser, token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export { signup, login };
