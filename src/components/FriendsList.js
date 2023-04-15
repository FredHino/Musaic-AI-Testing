import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const serverEndpoint = "https://my-server-domain.com";

const FriendsList = ({ userId }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const socket = io.connect(serverEndpoint);

    const joinRoom = (room) => {
      socket.emit("joinRoom", { userId, room });
    };

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return (
    <div>
      {friends.map((friend) => (
        <div>{friend.name}</div>
      ))}
    </div>
  );
};

export default FriendsList;