const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            res.status(401).json({ message: "Not authorized. no token provided." })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            res.status(401).json({ message: "User not found." })
        }

        next();

    } catch (error) {
        console.log("Token validation failed.");
        res.status(401).json({ message: "not authorized. token uiinvaid" })


    }
}

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: " Access denied, Admin Only can access this." })
    }
}

const userOnly = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        next();
    } else {
        res.status(403).json({ message: " Access denied, User Only can access this." })
    }
}

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'default_demo1_secret';
    if (!secret) {
        throw new Error('JWT_SECRET is not configured. Set it in .env');
    }
    return jwt.sign({ id }, secret, { expiresIn: '7d' });
}

module.exports = { authMiddleware, adminOnly, userOnly, generateToken }
