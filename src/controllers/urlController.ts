import { Request, Response } from "express";
import { Url } from "../models/Url.js";
import { nanoid } from "nanoid";
import moment from "moment";
import { currentUser } from "../middlewares/auth.js";

export const shortenUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { originalUrl, customCode, expiresInDays } = req.body;
  // Validate URL
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(originalUrl)) {
    res.status(400).json({ message: "Invalid URL format" });
    return;
  }

  const shortCode = customCode || nanoid(7);

  const existingUrl = await Url.findOne({ shortCode });
  if (existingUrl) {
    res.status(400).json({ message: "Custom code already in use" });
    return;
  }

  const expirationDate = expiresInDays
    ? moment().add(expiresInDays, "days").toDate()
    : undefined;

  const newUrl = new Url({
    user: currentUser,
    originalUrl,
    shortCode,
    expirationDate,
  });
  await newUrl.save();

  res.json({
    shortCode,
    shortenedUrl: `http://localhost:5000/api/urls/${shortCode}`,
  });
};

export const redirectUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { shortCode } = req.params;

  const url = await Url.findOne({ shortCode });
  if (!url) {
    res.status(404).json({ message: "Shortened URL not found" });
    return;
  }

  if (url.expirationDate && moment().isAfter(url.expirationDate)) {
    res.status(410).json({ message: "Shortened URL has expired" });
    return;
  }

  url.visitCount += 1;
  await url.save();

  res.redirect(url.originalUrl);
};

export const getUrlStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Entering getUrlStats function");
  try {
    const urls = await Url.find({ user: currentUser });
    console.log("Retrieved URLs:", urls);

    if (urls.length === 0) {
      res
        .status(404)
        .json({ message: "No shortened URLs found for this user" });
      return;
    }

    const response = urls.map((url) => ({
      user: url.user,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      visitCount: url.visitCount,
      createdAt: url.createdAt,
      expirationDate: url.expirationDate || "No expiration set",
    }));

    res.json(response);
  } catch (error) {
    console.error("Error fetching URL stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const deleteUrl = async (req: Request, res: Response): Promise<void> => {
  const { shortCode } = req.params;

  const url = await Url.findOneAndDelete({ shortCode });
  if (!url) {
    res.status(404).json({ message: "Shortened URL not found" });
    return;
  }

  res.json({ message: "Shortened URL deleted successfully" });
};
