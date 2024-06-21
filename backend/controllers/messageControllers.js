const asyncHandler = require('express-async-handler');
const Message = require('../Model/messageModel.js');
const Chat = require('../Model/chatModel');
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        res.status(400);
        throw new Error('Invalid message data');
    }
    var newmessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };
    try {
        var message = await Message.create(newmessage);
        message = await message.populate("sender", "-password");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "-password",
        })
        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
        })
        res.status(201).json(message);


    } catch (error) {
        res.status(400);
        throw new Error(error);
        
    }


});

const allmessages = asyncHandler(async(req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "-password")
        .populate("chat");

        res.status(200).json(messages);
        
    } catch (error) {

        res.status(400);
        throw new Error(error);
        
    }
});

module.exports = { sendMessage, allmessages };