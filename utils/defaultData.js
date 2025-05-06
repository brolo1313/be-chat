export function getDefaultChats(user) {
  return [
    {
      owner: user._id,
      firstName: "John",
      lastName: "Doe",
      lastMessage: null,
      messages: [],
    },
    {
      owner: user._id,
      firstName: "Anna",
      lastName: "Smith",
      lastMessage: null,
      messages: [],
    },
    {
      owner: user._id,
      firstName: "Ed",
      lastName: "Sheeran",
      lastMessage: null,
      messages: [],
    },
  ];
}

export function defaultMessages(chat, user) {
  return [
    {
      chat: chat._id,
      fromUser: user._id,
      text: `Hello from ${chat.firstName}! 👋`,
      isBot: true,
    },
  ];
}
