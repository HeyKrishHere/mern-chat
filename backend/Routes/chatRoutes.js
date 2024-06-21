const express = require("express");
const router = express.Router();
const {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup} = require("../controllers/chatControllers");

const { protect } = require("../Middleware/authMiddleware");


router.post('/',protect,accessChat);
router.get('/',protect,fetchChats);
router.post('/group',protect,createGroupChat);
router.put('/rename',protect,renameGroup);
router.put('/groupadd',protect,addToGroup);
router.put('/groupremove',protect,removeFromGroup);
//router.delete('/',protect,deleteChat);

module.exports = router