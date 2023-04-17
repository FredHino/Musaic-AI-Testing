import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:4001';

const socket = socketIOClient(ENDPOINT);

const io = {
  onConnect: (callback) => {
    socket.on('connect', () => {
      callback(socket.id);
    });
  },

  onDisconnect: (callback) => {
    socket.on('disconnect', () => {
      callback();
    });
  },

  // emit a new 'addFriend' event
  addFriend: (userId, friendId) => {
      socket.emit('addFriend', { userId, friendId });
  },

  // lobby related events
  joinRoom: (roomId) => {
      socket.emit('joinRoom', roomId);
  },

  leaveRoom: (roomId) => {
      socket.emit('leaveRoom', roomId);
  },
  
  lobbyUpdate: (roomId, playerIds) => {
      socket.emit('updateRooms', { roomId, playerIds });
  }
};

export default io;
