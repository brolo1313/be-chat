import Profile from "../models/Profile.js";
import Chat from "../models/Chat.js";
import Message from '../models/Message.js'; 
const getAllChat = async (req, res) => {
  try {
    const userId = req.userId;

    const profile = await Profile.findOne({ user: userId })
      .populate("chats")
      .exec();

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createChat = async (req, res) => {
  try {
    const userId = req.userId;
    const { firstName, lastName } = req.body;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const newChat = new Chat({
      owner: userId,
      firstName,
      lastName,
    });

    await newChat.save();

    profile.chats.push(newChat._id);
    await profile.save();

    res.status(200).json({
      createdChat: newChat,
      message: "Chat created successfully",
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateChat = async (req, res) => {
  try {
    const chatId = req.params.id;
    const userId = req.userId;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const chatIndex = profile.chats.indexOf(chatId);

    if (chatIndex === -1) {
      return res.status(404).json({ message: "Chat not found in profile" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(chatId, req.body, {
      new: true,
    });

    res.status(200).json({
      updatedChat,
      message: "Chat updated successfully",
    });
  } catch (error) {
    console.error("Error updating chat:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteChat = async (req, res) => {
  try {
    const chatId = req.params.id;
    const userId = req.userId;

    const profile = await Profile.findOne({ user: userId }).exec();

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const chatIndex = profile.chats.indexOf(chatId);

    if (chatIndex === -1) {
      return res.status(404).json({ message: "Chat not found in profile" });
    }

    profile.chats.splice(chatIndex, 1);
    await profile.save();

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getChatById = async (req, res) => {
  try {
    const chatId = req.params.id;
    const userId = req.userId;

    const profile = await Profile.findOne({ user: userId })
      .populate("chats")
      .exec();

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const chatIndex = profile.chats.indexOf(chatId);

    if (chatIndex === -1) {
      return res.status(404).json({ message: "Chat not found in profile" });
    }

    res.status(200).json(profile.chats[chatIndex]);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMessagesByChatId = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const userId = req.userId;

    const chat = await Chat.findOne({ _id: chatId, owner: userId }).populate('messages');

    if (!chat) {
      return res.status(404).json({ message: "Chat not found or access denied" });
    }

    res.status(200).json({
      chatId: chat._id,
      owner: chat.owner,
      firstName: chat.firstName,
      lastName: chat.lastName,
      messages: chat.messages,
      message: "Messages fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export {
  getAllChat,
  getChatById,
  getMessagesByChatId,
  createChat,
  updateChat,
  deleteChat,
};
