import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


    const namesoMap = new Map();
    const sonameMap = new Map();
io.on('connection', (socket) => {
    socket.on('join_room', (data) => {
        namesoMap.set(data.username,socket.id); 
        sonameMap.set(socket.id,data.username);
        io.to(data.roomId).emit("user_joined",{username:data.username , id:socket.id})
        socket.join(data.roomId)
        io.to(socket.id).emit("join_room", data)
    });

    socket.on("offer",data=>{
        io.to(data.to).emit("incomming",{from:socket.id,offer:data.offer})})

    socket.on("answer",data=>{
        io.to(data.to).emit("answer",{from:socket.id , answer:data.answer})})

});


server.listen(5000, () => console.log("Server running on port 5000"));
