const express = require('express');
const { authMiddleware, adminOnly } = require('../auth/middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();


router.use(authMiddleware, adminOnly);


router.post('/create', userController.createUser)
router.get('/getall', userController.getAllUsers)
router.put('/update/:id', userController.updateUser)
router.delete('/delete/:id', userController.deleteUser)


router.post('/admin/assign', userController.assignDomain)
router.get('/admin/get', userController.getAllDomains)
router.delete('/admin/delete/:id', userController.deleteDomain)




module.exports = router;