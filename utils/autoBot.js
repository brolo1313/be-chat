import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

let intervalId;
export const startAutoBot = (io, socket, userId) => {
  if (intervalId) return;

  intervalId = setInterval(async () => {
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
};

export const stopAutoBot = () => {
  console.log("stopAutoBot");
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};
