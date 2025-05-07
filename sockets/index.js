import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { successMsg, errorMsg } from "../utils/logger.js";
import { handleBotReply } from "../helpers/handleBotReplay.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import { startAutoBot, stopAutoBot } from "../utils/autoBot.js";

export class SocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: ["http://localhost:4202", "http://localhost:4201"],
        methods: ["GET", "POST"],
      },
    });
    this.botTimeouts = new Map();
    this.init();
  }

  init() {
    this.io.on("connection", (socket) => {
      this.handleConnection(socket);
    });
  }

  async handleConnection(socket) {
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
      this.handleAutoBotStatus(socket, userId, status);
    });

    socket.on("send-message", async ({ chatId, text }) => {
      this.handleSendMessage(socket, chatId, text, userId);
    });

    socket.on("disconnect", () => {
      this.handleDisconnect(socket);
    });
  }

  async handleAutoBotStatus(socket, userId, status) {
    console.log("auto-bot-status", status);
    try {
      const profile = await Profile.findOne({ user: userId });

      if (!profile) return socket.emit("error", "Profile not found");

      profile.autoMessaging = status;
      await profile.save();

      if (status) {
        startAutoBot(this.io, socket, userId);
      } else {
        stopAutoBot();
      }
    } catch (err) {
      console.log(err);
      socket.emit("auto-bot-status error", err);
    }
  }

  async handleSendMessage(socket, chatId, text, userId) {
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

      this.io.to(socket.id).emit("new-message", {
        chatId,
        message: newMessage,
      });

      handleBotReply(this.io, chat, socket.id, this.botTimeouts);
    } catch (err) {
      console.error(errorMsg("Socket message error:", err));
      socket.emit("error", "Internal error");
    }
  }

  handleDisconnect(socket) {
    stopAutoBot();

    const timeoutId = this.botTimeouts.get(socket.id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.botTimeouts.delete(socket.id);
    }

    console.log("⛔ Socket disconnected:", socket.id);
  }
}

export function initSocketIO(server) {
  new SocketService(server);
}
