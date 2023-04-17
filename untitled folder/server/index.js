const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const rooms = require("./rooms");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

rooms.initRooms();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", ({ userId, room }) => {
    rooms.joinRoom(socket, { userId, room });
  });

  socket.on("leaveRoom", ({ userId, room }) => {
    rooms.leaveRoom(socket, { userId, room });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const port = process.env.PORT || 4001;
server.listen(port, () => console.log(`Listening on port ${port}`));
