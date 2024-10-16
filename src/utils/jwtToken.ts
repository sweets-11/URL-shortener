import { IUser } from "../models/user.js";

export const sendToken = (
  res: any,
  user: IUser,
  statusCode: any,
  message: any
) => {
  const token = user.getJWTToken();

  const userData = {
    _id: user._id,
    email: user.email,
  };

  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + 100 * 24 * 60 * 60 * 300),
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, message, user: userData, token: token });
};
