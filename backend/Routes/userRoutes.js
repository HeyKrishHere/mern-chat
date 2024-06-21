const express = require('express');
const router = express.Router();
const {protect} = require('../Middleware/authMiddleware.js');
const {registerUser,authUser,allUsers}= require('../controllers/userControllers');

router.post('/',registerUser)
router.post('/login',authUser )
router.get('/',protect,allUsers);

module.exports = router; 