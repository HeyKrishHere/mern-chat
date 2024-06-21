const express=require('express');
const{protect}=require('../Middleware/authMiddleware');
const{sendMessage,allmessages}=require('../controllers/messageControllers');

const router=express.Router();

router.route('/').post(protect,sendMessage);
router.route('/:chatId').get(protect,allmessages);

module.exports=router;
