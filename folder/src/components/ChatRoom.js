import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const serverEndpoint = "https://my-server-domain.com";

const ChatRoom = ({ roomId, userId }) => {
  const [chatLog, setChatLog] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = io.connect(serverEndpoint);

    socket.on("message", (data) => {
      if (data.roomId === roomId) {
        setChatLog((log) => [
          ...log,
          {
            userId: data.userId,
            message: data.message,
          },
        ]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    const socket = io.connect(serverEndpoint);
    socket.emit("message", {
      roomId,
      userId,
      message,
    });
    setMessage("");
  };

  return (
    <div>
      <div>
        {chatLog.map((message) => (
          <div key={message.userId}>{message.message}</div>
        ))}
      </div>
      <input value={message} onChange={(event) => setMessage(event.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;