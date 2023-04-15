import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const serverEndpoint = "https://my-server-domain.com";

const Lobby = ({ userId }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const socket = io.connect(serverEndpoint);

    const joinRoom = (room, isPrivateChat) => {
      if (isPrivateChat) {
        const friendId = room.split(":").filter((id) => id !== userId)[0];
        socket.emit("joinPrivateChat", { roomId: room, friendId });
      } else {
        socket.emit("joinRoom", { userId, room });
      }
    };

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return (
    <div>
      {Object.keys(rooms).map((roomName) => {
        const room = rooms[roomName];
        const isPrivateChat = roomName.includes(":");
        const friendId = isPrivateChat && roomName.split(":").filter((id) => id !== userId)[0];
        return (
          <button
            key={roomName}
            onClick={() => joinRoom(roomName, isPrivateChat)}
          >
            {isPrivateChat
              ? `Chat with friend ${friendId}`
              : `Room ${roomName}`}
          </button>
        );
      })}
    </div>
  );
};

export default Lobby;