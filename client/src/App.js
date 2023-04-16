import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Track from "./components/Track/Track";
import Profile from "./components/Profile/Profile";
import FriendsList from "./components/FriendsList/FriendsList";
import RoomList from "./components/RoomList/RoomList";

const ENDPOINT = "http://localhost:3000";

function App() {
  const [tracks, setTracks] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentRoomPlayers, setCurrentRoomPlayers] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = socketIOClient(ENDPOINT);
    setSocket(s);

    s.on("connect", () => {
      console.log(`Connected to server: ${s.id}`);
    });

    s.on("disconnect", () => {
      console.log(`Disconnected from server: ${s.id}`);
    });

    s.on("updateRooms", (newRoom) => {
      console.log(`Received updated room list: ${newRoom}`);
      setCurrentRoomPlayers(newRoom.playerIds);
    });

    s.on("joinRoom", ({ room }) => {
      console.log(`Joined room: ${room.name}`);
      setCurrentRoom(room);
      setCurrentRoomPlayers(room.playerIds);
    });

    /** NEW CODE **/
    // Add event listener for the 'updateFriends' event, which will
    // receive an array of friends when the user's friend list needs
    // to be updated.
    s.on("updateFriends", (friends) => {
      console.log(`Received updated friend list: ${friends}`);
      setFriendsList(friends);
    });

    return () => s.disconnect();
  }, []);

  const handleAddFriend = (friend) => {
    // Emit the 'addFriend' event to the server, along with the user's
    // and the friend's IDs.
    socket.emit("addFriend", { userId: socket.id, friendId: friend.id });
  };

  return (
    <div className="App">
      <div className="left-container">
        <FriendsList friends={friendsList} onAddFriend={handleAddFriend} />
        <RoomList currentRoom={currentRoom} currentRoomPlayers={currentRoomPlayers} />
      </div>
      <div className="right-container">
        <div className="track-list">
          {tracks.map((t) => (
            <Track
              key={t.id}
              track={t}
              socket={socket}
              currentRoom={currentRoom}
              currentRoomPlayers={currentRoomPlayers}
            />
          ))}
        </div>
        {currentRoom && <Profile socket={socket} />}
      </div>
    </div>
  );
}

export default App;
