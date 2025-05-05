import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

export async function handleBotReply(socket, chat, socketId, botTimeouts) {
  const timeoutId = setTimeout(async () => {
    try {
      const quoteRes = await fetch("https://dummyjson.com/quotes/random");
      const quoteData = await quoteRes.json();

      if (!quoteData?.quote) throw new Error("No quote returned");

      const botMessage = await Message.create({
        chat: chat._id,
        text: quoteData.quote,
        isBot: true,
      });

      chat.messages.push(botMessage._id);
      await chat.save();

      socket.to(socketId).emit("new-message", {
        chatId: chat._id,
        message: botMessage,
      });
    } catch (err) {
      console.error("Bot reply error:", err.message);
      socket.emit("error", "Bot reply failed");
    } finally {
      botTimeouts.delete(socketId);
    }
  }, 3000);

  botTimeouts.set(socketId, timeoutId);
}
