import mongoose, { Schema, model, Document } from "mongoose";

export interface IUrl extends Document {
  user: object;
  originalUrl: string;
  shortCode: string;
  expirationDate?: Date;
  createdAt: Date;
  visitCount: number;
}

const UrlSchema = new Schema<IUrl>({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  expirationDate: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
  visitCount: { type: Number, default: 0 },
});

export const Url = model<IUrl>("Url", UrlSchema);
