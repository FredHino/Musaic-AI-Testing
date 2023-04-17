const privateChats = {};

const getPrivateChatKey = (user1, user2) => {
  return [user1, user2].sort().join(":");
};

const createPrivateChat = ({ user1, user2 }) => {
  const chatKey = getPrivateChatKey(user1, user2);
  privateChats[chatKey] = { messages: [] };
};

const deletePrivateChat = ({ user1, user2 }) => {
  const chatKey = getPrivateChatKey(user1, user2);
  delete privateChats[chatKey];
};

const emitMessageToPrivateChat = ({ user1, user2, message }) => {
  const chatKey = getPrivateChatKey(user1, user2);
  const chat = privateChats[chatKey];
  if (chat) {
    chat.messages.push({ user: user1, message });
  } else {
    createPrivateChat({ user1, user2 });
    privateChats[chatKey].messages.push({ user: user1, message });
  }
};

module.exports = { createPrivateChat, deletePrivateChat, emitMessageToPrivateChat };