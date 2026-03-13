import jwt from "jsonwebtoken";
import User from "../models/userModel/User.js";
import TokenBlacklist from "../models/tokenBlacklist.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const blacklisted = await TokenBlacklist.findOne({ token });
      if (blacklisted) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (without password)
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Unauthorized" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
