const jwt = require('jsonwebtoken'); 
const SECRET_KEY = "123456";

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);
    if (authHeader) {
        jwt.verify(authHeader, SECRET_KEY, (err, user) => {
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