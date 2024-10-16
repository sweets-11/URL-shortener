import { Request, Response } from "express";
import { User } from "../models/user.js";
import { sendToken } from "../utils/jwtToken.js";
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    user = new User({
      email,
      password,
    });

    await user.save();

    sendToken(res, user, 201, "User registered successfully");
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordMatch = user.comparePassword(password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    sendToken(res, user, 200, `welcome Back`);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
