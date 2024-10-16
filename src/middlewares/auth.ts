import mongoose from "mongoose";
import { User } from "../models/user.js";
import { IUser } from "../models/user.js";
import jwt from "jsonwebtoken";

interface JwtPayload {
  _id: mongoose.Types.ObjectId;
}
export let currentUser: mongoose.Types.ObjectId;
export const isAuthenticated = async (req: any, res: any, next: any) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.status(401).json({ success: false, message: "Token not found" });
  }
  const bearer = bearerHeader.split(" ");
  const token = bearer[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Token not found" });
  }

  try {
    const { _id } = jwt.verify(
      token,
      "andfndksfdbdsbdsdjcjdndjv"
    ) as JwtPayload;
    req.user = await User.findById(_id);
    currentUser = _id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
