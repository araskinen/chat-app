import { NextFunction, Response } from "express";
import { Message } from "../models/Message";
import type { AuthRequest } from "../middleware/authMiddleware";

const PAGE_SIZE = 50;

export async function listMessages(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const { roomId } = req.params;
  const page = Math.max(1, parseInt(String(req.query["page"] ?? "1"), 10));

  try {
    const messages = await Message.find({ room: roomId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .populate("sender", "username avatarUrl")
      .lean();

    res.json(messages.reverse());
  } catch (err) {
    next(err);
  }
}
