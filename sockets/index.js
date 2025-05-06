import { Server } from "socket.io";
import { successMsg, errorMsg } from "../utils/logger.js";
import jwt from "jsonwebtoken";
import { handleBotReply } from "../helpers/handleBotReplay.js";

import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import { startAutoBot, stopAutoBot } from "../utils/autoBot.js";

export default function initSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:4202", "http://localhost:4201"],
      methods: ["GET", "POST"],
    },
  });

  const botTimeouts = new Map();

  io.on("connection", (socket) => {
    console.log(successMsg("✅ Socket connected:", socket.id));

    const token = socket.handshake.auth?.token;
    if (!token) return socket.disconnect();

    let userId;

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      userId = decoded.id;
    } catch (err) {
      console.error("Token error", err);
      return socket.disconnect();
    }

    socket.on("auto-bot-status", async (status) => {
      console.log("auto-bot-status", status);
      try {
        const profile = await Profile.findOne({ user: userId });

        if (!profile) return socket.emit("error", "Profile not found");
        profile.autoMessaging = status;
        profile.save();

        status ? startAutoBot(io, socket, userId) : stopAutoBot();
      } catch (err) {
        console.log(err);
        socket.emit("auto-bot-status error", err);
      }
    });

    socket.on("send-message", async ({ chatId, text }) => {
      try {
        if (!chatId || !text?.trim()) {
          console.log("send-message event received with missing data:", {
            chatId,
            text,
          });
          return socket.emit("error", "Missing chatId or text");
        }

        const chat = await Chat.findById(chatId);
        if (!chat) return socket.emit("error", "Chat not found");

        const user = await User.findById(userId);
        if (!user) return socket.emit("error", "User not found");

        if (String(chat.owner) !== String(user._id)) {
          return socket.emit("error", "Unauthorized");
        }

        const newMessage = await Message.create({
          chat: chat._id,
          fromUser: user._id,
          text,
        });

        chat.messages.push(newMessage._id);
        await chat.save();

        io.to(socket.id).emit("new-message", {
          chatId,
          message: newMessage,
        });

        handleBotReply(io, chat, socket.id, botTimeouts);
      } catch (err) {
        console.error(errorMsg("Socket message error:", err));
        socket.emit("error", "Internal error");
      }
    });

    socket.on("disconnect", () => {
      stopAutoBot();

      const timeoutId = botTimeouts.get(socket.id);
      if (timeoutId) {
        clearTimeout(timeoutId);
        botTimeouts.delete(socket.id);
      }
      console.log("⛔ Socket disconnected:", socket.id);
    });
  });

  return io;
}
