import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  createdAt: Date;

  comparePassword(password: any): boolean;
  getJWTToken(): string;
}

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already Exist"],
      required: [true, "Please enter Name"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [8, "Password should be greater than 8 characters"],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare Password

schema.methods.comparePassword = async function (password: any) {
  return await bcrypt.compare(password, this.password);
};

schema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, "andfndksfdbdsbdsdjcjdndjv", {
    expiresIn: 100 * 24 * 60 * 60 * 1000,
  });
};

export const User = mongoose.model<IUser>("User", schema);
