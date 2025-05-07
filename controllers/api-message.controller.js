import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

// const updateChat = async (req, res) => {
//   try {
//     const chatId = req.params.id;
//     const userId = req.userId;

//     const profile = await Profile.findOne({ user: userId });

//     if (!profile) {
//       return res.status(404).json({ message: "Profile not found" });
//     }

//     const chatIndex = profile.chats.indexOf(chatId);

//     if (chatIndex === -1) {
//       return res.status(404).json({ message: "Chat not found in profile" });
//     }

//     const updatedChat = await Chat.findByIdAndUpdate(chatId, req.body, {
//       new: true,
//     });

//     res.status(200).json({
//       updatedChat,
//       message: "Chat updated successfully",
//     });
//   } catch (error) {
//     console.error("Error updating chat:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await Chat.updateOne(
      { messages: messageId },
      { $pull: { messages: messageId } }
    );

    const chat = await Chat.findById(message.chat);
    const isLast = chat?.lastMessage?.toString() === messageId;
    if (isLast) {
      const remainingMessages = await Message.find({
        _id: { $in: chat.messages, $ne: messageId },
      })
        .sort({ createdAt: -1 })
        .limit(1);

      const newLastMessage = remainingMessages[0]?._id || null;

      await Chat.updateOne(
        { _id: chat._id },
        { $set: { lastMessage: newLastMessage } }
      );
    }
    res
      .status(200)
      .json({
        success: true,
        messageData: { chatId: chat._id, messageId: messageId, text: message.text , isLast },
      });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { deleteMessage };
