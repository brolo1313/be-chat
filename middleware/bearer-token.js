import jwt from "jsonwebtoken";

const verifyByBearerToken = (req, res, next) => {
  const secretKey = process.env.SECRET_KEY || "default-secret-key";
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token not found" });
  }

  const token = bearerHeader.split(" ")[1];

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error("JWT verify error:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = decoded.id;
    next();
  });
};

export default verifyByBearerToken;
