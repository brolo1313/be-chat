import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
      });
    }

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
    });
  } catch (error) {
    next(error);
  }
};

export default handleGoogleAuth;
