let rooms = [];

const initRooms = () => {
  rooms = [
    { name: "Room 101", playerIds: [] },
    { name: "Room 102", playerIds: [] },
    { name: "Room 103", playerIds: [] },
    { name: "Room 104", playerIds: [] },
  ];
};

const joinRoom = (socket, { userId, room }) => {
  const newRoom = rooms.find((r) => r.name === room);
  if (!newRoom) {
    socket.emit("error", { message: `Room ${room} does not exist` });
    return;
  }

  let existingRoom = null;
  rooms.forEach((r) => {
    if (r.playerIds.includes(userId)) {
      existingRoom = r;
    }
  });

  if (existingRoom && existingRoom.name === newRoom.name) {
    socket.emit("error", { message: "You are already in this room" });
    return;
  }

  if (existingRoom) {
    existingRoom.playerIds = existingRoom.playerIds.filter(
      (id) => id !== userId
    );
    socket.leave(existingRoom.name);
  }

  newRoom.playerIds.push(userId);
  socket.join(newRoom.name);

  socket.emit("joinRoom", { room: newRoom });
  socket.broadcast.emit("updateRooms", newRoom);
};

const leaveRoom = (socket, { userId, room }) => {
  const targetRoom = rooms.find((r) => r.playerIds.includes(userId));
  
  if (!targetRoom) {
    socket.emit("error", { message: "You are not in a room" });
    return;
  }

  if (targetRoom.name !== room) {
    socket.emit("error", {
      message: `You are not in room ${room}`,n
    });
    return;
  }

  targetRoom.playerIds = targetRoom.playerIds.filter(
    (id) => id !== userId
  );
  socket.leave(targetRoom.name);
  socket.emit("leaveRoom", { room: targetRoom });
  socket.broadcast.emit("updateRooms", targetRoom);
};

module.exports = { initRooms, joinRoom, leaveRoom };
