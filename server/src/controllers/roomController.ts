import { NextFunction, Response } from "express";
import { Room } from "../models/Room";
import type { AuthRequest } from "../middleware/authMiddleware";

export async function listRooms(
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 }).limit(50);
    res.json(rooms);
  } catch (err) {
    next(err);
  }
}

export async function createRoom(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, description } = req.body as {
      name: string;
      description?: string;
    };
    if (!name?.trim()) {
      res.status(400).json({ message: "Room name is required" });
      return;
    }
    const room = await Room.create({
      name: name.trim(),
      description,
      createdBy: req.userId,
      members: [req.userId],
    });
    res.status(201).json(room);
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({ message: "A room with that name already exists" });
      return;
    }
    next(err);
  }
}

export async function joinRoom(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params["roomId"],
      { $addToSet: { members: req.userId } },
      { new: true },
    );
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }
    res.json(room);
  } catch (err) {
    next(err);
  }
}
