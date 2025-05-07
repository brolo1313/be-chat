import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

const intervalMap = new Map();
export const startAutoBot = (io, socket, userId) => {
  if (intervalMap.has(socket.id)) return;

  console.log("stop AutoBot for socket:", socket.id);
  const intervalId = setInterval(async () => {
    try {
      const chats = await Chat.find({ owner: userId });

      if (!chats || chats.length === 0) {
        console.error("No chat found for user, stopping AutoBot.");
        io.to(chat._id.toString()).emit(
          "auto-bot-message",
          "No chat found for user, stopping AutoBot."
        );
        clearInterval(intervalId);
        intervalId = null;
        return;
      }

      const randomChat = chats[Math.floor(Math.random() * chats.length)];

      const quoteRes = await fetch("https://dummyjson.com/quotes/random");
      const quoteData = await quoteRes.json();

      if (!quoteData?.quote) throw new Error("No quote returned");
      const message = await Message.create({
        chat: randomChat._id,
        fromUser: userId,
        text: quoteData.quote,
        isBot: true,
      });

      const chat = await Chat.findById(randomChat._id);
      chat.messages.push(message._id);
      chat.lastMessage = message._id;
      await chat.save();

      io.to(socket.id).emit("auto-bot-message", {
        message: message,
        fullName: `${chat.firstName} ${chat.lastName}`,
      });
    } catch (error) {
      console.error("Error in AutoBot:", error);
      clearInterval(intervalId);
      intervalId = null;
    }
  }, 10000);

  intervalMap.set(socket.id, intervalId);
};

export const stopAutoBot = (socketId) => {
  const intervalId = intervalMap.get(socketId);
  if (intervalId) {
    console.log("stop AutoBot for socket:", socketId);
    clearInterval(intervalId);
    intervalMap.delete(socketId);
  }
};
