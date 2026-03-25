const express = require('express');
const { authMiddleware, adminOnly } = require('../auth/middleware');
const domainController = require('../controllers/domain.controller');

const router = express.Router();


router.use(authMiddleware);


router.post('/create', domainController.createDomain)
router.get('/get', domainController.getMyDomain)
router.delete('/delete/:id', domainController.deleteDomain)




module.exports = router;