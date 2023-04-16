import ioClient from './io';

const socket = ioClient();

// on successful connection, set the user's socket Id
socket.onConnect((socketId) => {
  console.log(`connected to server with ID: ${socketId}`);
});

// listen for updates to the friends list
socket.on('updateFriendsList', (friendsList) => {
  console.log(`update friends list: ${friendsList}`);
});

// listen for friend requests
socket.on('friendRequest', (friendRequest) => {
  console.log(`friend request from ${friendRequest.friendRequester}`);
});

// emit an 'addFriend' event
const addFriend = (userId, friendId) => {
    socket.addFriend(userId, friendId);
};

// lobby related events
socket.on('updateRooms', (roomData) => {
    console.log(`update lobby with room data: ${roomData}`);
});

const joinRoom = (roomId) => {
    // emit a 'joinRoom' event
    socket.joinRoom(roomId);
};

const leaveRoom = (roomId) => {
    // emit a 'leaveRoom' event
    socket.leaveRoom(roomId);
};

const socketClient = {
  socket,
  addFriend,
  joinRoom,
  leaveRoom
};

export default socketClient;
