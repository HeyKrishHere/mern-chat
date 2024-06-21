const express = require('express');
const cors= require('cors');
const app=express();
const dotenv=require('dotenv');
const userRoutes=require('./Routes/userRoutes.js');
const chatRoutes=require('./Routes/chatRoutes.js');
const messageRoutes=require('./Routes/messageRoutes.js');
const PORT=process.env.PORT || 3000;
dotenv.config();
const connectDB = require('./config/db.js');

connectDB();
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)

const server=app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

const io = require('socket.io')(server,{
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:5137',
      }
})

io.on('connection', (socket) => {
    console.log("Connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    })

    socket.on("join chat", (room)=>{
        socket.join(room);
        console.log(`User joined chat room ${room}`);
    })

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if(!chat.users) return console.log("Chat.users not defined");

        chat.users.forEach(user => {
            if(user._id === newMessage.sender._id) return;
            socket.in(user._id).emit('message received', newMessageReceived);
        })
    })
});