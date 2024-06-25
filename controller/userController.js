const User = require('../model/user.js'); 
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

        const token = jwt.sign({ email: existingUser.email, id: existingUser.username }, SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error); // Log the error
        res.status(500).json({ message: "Something went wrong" });
    }
};

const addingQ = async (req, res) => {
    const { email, id, queryText,queryString } = req.body;
    try {
        const currentUser = await User.findOne({ email });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const newQuery = { id, queryText, queryString};
        currentUser.queries.push(newQuery);
        await currentUser.save();

        res.status(200).json({ message: "Query added successfully" });
    } catch (error) {
        console.error('Error during adding Query:', error); // Log the error
        res.status(500).json({ message: "Something went wrong" });
    }
}

const updateQ = async (req, res) => {
    const { email, id, updatedText,updatedString } = req.body;
    try {
        const currentUser = await User.findOne({ email });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const queryIndex = currentUser.queries.findIndex(query => query.id === id);
        if (queryIndex === -1) {
            return res.status(404).json({ message: "Query not found" });
        }

        const query = currentUser.queries;

        query[queryIndex].queryText = updatedText;
        query[queryIndex].queryString=updatedString;
        await currentUser.save();

        res.status(200).json({ message: "Query updated successfully" });
    } catch (error) {
        console.error('Error during updating Query:', error); // Log the error
        res.status(500).json({ message: "Something went wrong" });
    }
}

const deleteQ = async (req, res) => {
    const { email, id } = req.body;
    try {
        const currentUser = await User.findOne({ email });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the index of the query to be deleted
        const queryIndex = currentUser.queries.findIndex(query => query.id === id);
        if (queryIndex === -1) {
            return res.status(404).json({ message: "Query not found" });
        }
        currentUser.queries.splice(queryIndex, 1);

        await currentUser.save();

        res.status(200).json({ message: "Query deleted successfully" });
    } catch (error) {
        console.error('Error during deleting Query:', error); // Log the error
        res.status(500).json({ message: "Something went wrong" });
    }
}


module.exports = { signup, login, addingQ, updateQ, deleteQ};
