const express = require('express');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../auth/middleware');

const router = express.Router();


router.post('/login', (req, res, next) => {
    console.log(123, req.body);
    next();

}, authController.login)
router.post('/me', authMiddleware, authController.getMe)



module.exports = router;