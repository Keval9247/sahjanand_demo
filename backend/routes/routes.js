const express = require('express');

const router = express.Router();

const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const domainRoutes = require('./domain.route');



router.use('/auth', authRoutes)

router.use('/user', userRoutes)
router.use('/domains', domainRoutes)



module.exports = router;