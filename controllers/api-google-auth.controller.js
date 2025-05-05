import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Chat from "../models/Chat.js";

const handleGoogleAuth = async (req, res, next) => {
  try {
    const { firstName, lastName, email, picture, googleId } = req.body;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        firstName,
        lastName,
        email,
        googleId,
        avatar: picture,
        role: "user",
        picture: picture,
      });
    }

    let profile = await Profile.findOne({ user: user._id });

    const chats = await Chat.insertMany([
      {
        owner: user._id,
        firstName: "John",
        lastName: "Doe",
        messages: [],
      },
      {
        owner: user._id,
        firstName: "Anna",
        lastName: "Smith",
        messages: [],
      },
      {
        owner: user._id,
        firstName: "Ed",
        lastName: "Sheeran",
        messages: [],
      },
    ]);

    if (!profile) {
      profile = await Profile.create({
        user: user._id,
        chats: chats.map((chat) => chat._id),
        autoMessaging: false,
      });
    }

    user.profile = profile._id;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 3600,
    });

    res.status(200).json({
      expiresIn: 3600,
      accessToken: token,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.role,
      picture: user.picture,
    });
  } catch (error) {
    next(error);
  }
};

export default handleGoogleAuth;
