const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true},
    queryText: { type: String, required: true },
    queryString: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    queries: { type: [querySchema], default: [] }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
