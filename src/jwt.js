const jwt = require('jsonwebtoken'); 
const SECRET_KEY = "123456";

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.Authorization;
    console.log(authHeader);
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Access denied. No token provided.' });
    }
};


module.exports = {authenticateJWT};