import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";


dotenv.config();
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.URLC,
        methods: ["GET", "POST"]
    }
});


io.on('connection', (socket) => {
    socket.on('join_room', (data) => {
        io.to(data.roomId).emit("user_joined",{username:data.username , id:socket.id})
        socket.join(data.roomId)
        io.to(socket.id).emit("join_room", data)
    });

    socket.on("offer",data=>{
        io.to(data.to).emit("incomming",{from:socket.id,offer:data.off})})

    socket.on("answer",data=>{
        io.to(data.to).emit("answer",{from:socket.id , answer:data.ans})})

        socket.on("peer:nego:needed", ({ to, off }) => {
            console.log("peer:nego:needed", off);
            io.to(to).emit("peer:nego:needed", { from: socket.id, off });
          });
        
          socket.on("peer:nego:done", ({ to, ans }) => {
            console.log("peer:nego:done", ans);
            io.to(to).emit("peer:nego:final", { from: socket.id, ans });
          });

          socket.on('left', (data) => {
            io.to(data.to).emit('user_left');
        });

});


server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
